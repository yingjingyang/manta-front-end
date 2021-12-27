import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef
} from 'react';
import PropTypes from 'prop-types';
import { BN } from 'bn.js';
import Balance from 'types/Balance';
import { SignerInterface } from 'signer-interface';
import signerInterfaceConfig from 'config/signerInterfaceConfig';
import Version from 'types/Version';
import { useSubstrate } from './substrateContext';

const PrivateWalletContext = createContext();

export const PrivateWalletContextProvider = (props) => {
  const { api } = useSubstrate();
  const [spendableAssets, setSpendableAssets] = useState(null);
  const [signerIsConnected, setSignerIsConnected] = useState(null);
  const [signerVersion, setSignerVersion] = useState(null);
  const refreshIsInProgress = useRef(false);

  const fetchSignerVersion = async () => {
    if (!api) return;
    await api.isReady;
    try {
      const signerInterface = new SignerInterface(api, signerInterfaceConfig);
      const signerVersion = await signerInterface.getSignerVersion();
      const signerIsConnected = !!signerVersion;
      setSignerIsConnected(signerIsConnected);
      if (signerIsConnected) {
        setSignerVersion(new Version(signerVersion));
      } else {
        setSignerVersion(null);
      }
    } catch (err) {
      setSignerIsConnected(false);
      setSignerVersion(null);
      console.error('SignerVersion - ', err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSignerVersion();
    }, 1000);

    return () => clearInterval(interval);
  }, [api]);

  useEffect(() => {
    const refreshPrivateAssets = async () => {
      const signerInterface = new SignerInterface(api, signerInterfaceConfig);
      const signerVersion = await signerInterface.getSignerVersion();
      const signerIsConnected = !!signerVersion;
      if (signerIsConnected) {
        const privateAssets = await signerInterface.recoverAccount();
        setSpendableAssets(privateAssets);
      }
    };

    const refreshPrivateAssetsOnNewBlock = async () => {
      if (!api) {
        return;
      }
      await api.isReady;
      api.rpc.chain.subscribeNewHeads(async () => {
        if (refreshIsInProgress.current === false) {
          refreshIsInProgress.current = true;
          await refreshPrivateAssets();
          refreshIsInProgress.current = false;
        }
      });
    };
    refreshPrivateAssetsOnNewBlock();
  }, [api]);

  const getSpendableAssetsByAssetId = (assetId) => {
    return spendableAssets !== null
      ? spendableAssets.filter((asset) => {
        return asset.assetId === assetId;
      })
      : null;
  };

  const saveSpendableAssets = (spendableAssets) => {
    setSpendableAssets(spendableAssets);
  };

  const saveSpendableAsset = (newSpendableAsset) => {
    const newSpendableAssets = [...spendableAssets, newSpendableAsset];
    setSpendableAssets(newSpendableAssets);
  };

  const getSpendableBalance = (assetType) => {
    const spendableAssets = getSpendableAssetsByAssetId(assetType.assetId, api);
    const valueAtomicUnits = spendableAssets
      ?.map((asset) => asset.valueAtomicUnits)
      .reduce((prev, curr) => {
        return prev.add(curr);
      }, new BN(0));

    return valueAtomicUnits ? new Balance(assetType, valueAtomicUnits) : null;
  };

  const value = {
    spendableAssets: spendableAssets,
    getSpendableAssetsByAssetId: getSpendableAssetsByAssetId,
    saveSpendableAssets: saveSpendableAssets,
    saveSpendableAsset: saveSpendableAsset,
    getSpendableBalance: getSpendableBalance,
    signerIsConnected: signerIsConnected,
    signerVersion: signerVersion
  };

  return (
    <PrivateWalletContext.Provider value={value}>
      {props.children}
    </PrivateWalletContext.Provider>
  );
};

PrivateWalletContextProvider.propTypes = {
  children: PropTypes.any
};

export const usePrivateWallet = () => ({ ...useContext(PrivateWalletContext) });
