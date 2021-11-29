import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { BN } from 'bn.js';
import {
  // loadSpendableAssetsFromStorage,
  persistSpendableAssetsToStorage,
} from 'utils/persistence/AssetStorage';
import Balance from 'types/Balance';
import { SignerInterface, BrowserAddressStore } from 'signer-interface';
import config from 'config';
import { useSubstrate } from './substrateContext';

const PrivateWalletContext = createContext();

export const PrivateWalletContextProvider = (props) => {
  const { api } = useSubstrate();
  const [spendableAssets, setSpendableAssets] = useState(null);
  const refreshIsInProgress = useRef(false);

  useEffect(() => {
    const refreshPrivateAssets = async () => {
      const signerInterface = new SignerInterface(
        api,
        new BrowserAddressStore(config.BIP_44_COIN_TYPE_ID)
      );
      const signerIsConnected = await signerInterface.signerIsConnected();
      if (signerIsConnected) {
        const privateAssets = await signerInterface.recoverAccount();
        setSpendableAssets(privateAssets);
        persistSpendableAssetsToStorage(privateAssets, api);
      }
    };

    const refreshPrivateAssetsOnNewBlock = async () => {
      if (!api) {
        return;
      }
      await api.isReady;
      api.rpc.chain.subscribeNewHeads(async () => {
        if (refreshIsInProgress.current === false) {
          refreshIsInProgress.current === true;
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
    persistSpendableAssetsToStorage(spendableAssets, api);
  };

  const saveSpendableAsset = (newSpendableAsset) => {
    const newSpendableAssets = [...spendableAssets, newSpendableAsset];
    setSpendableAssets(newSpendableAssets);
    persistSpendableAssetsToStorage(newSpendableAssets, api);
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
  };

  return (
    <PrivateWalletContext.Provider value={value}>
      {props.children}
    </PrivateWalletContext.Provider>
  );
};

PrivateWalletContext.propTypes = {
  children: PropTypes.any,
};

export const usePrivateWallet = () => ({ ...useContext(PrivateWalletContext) });
