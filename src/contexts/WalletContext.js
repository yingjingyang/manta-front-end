import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { BN } from 'bn.js';
import {
  loadSpendableAssetsFromStorage,
  persistSpendableAssetsToStorage,
} from 'utils/persistence/AssetStorage';
import { useSubstrate } from './SubstrateContext';

const WalletContext = createContext();

export const WalletContextProvider = (props) => {
  const { api } = useSubstrate();
  const [spendableAssets, setSpendableAssets] = useState([]);

  useEffect(() => {
    const loadSpendableAssets = async () => {
      if (spendableAssets === null && api) {
        await api.isReady;
        setSpendableAssets(loadSpendableAssetsFromStorage(api));
      }
    };
    loadSpendableAssets();
  }, [api]);

  const getSpendableAssetsByAssetId = (assetId) => {
    return spendableAssets.filter(
      (asset) => asset.assetId.toNumber() === assetId
    );
  };

  const removeSpendableAsset = (assetToRemove, api) => {
    const newSpendableAssets = spendableAssets.filter(
      (asset) => !_.isEqual(asset, assetToRemove)
    );
    setSpendableAssets(newSpendableAssets);
    persistSpendableAssetsToStorage(newSpendableAssets, api);
  };

  const saveSpendableAssets = (spendableAssets, api) => {
    setSpendableAssets(spendableAssets);
    persistSpendableAssetsToStorage(spendableAssets, api);
  };

  const saveSpendableAsset = (newSpendableAsset, api) => {
    const newSpendableAssets = [...spendableAssets, newSpendableAsset];
    setSpendableAssets(newSpendableAssets);
    persistSpendableAssetsToStorage(newSpendableAssets, api);
  };

  const getSpendableBalance = (assetId, api) => {
    return getSpendableAssetsByAssetId(assetId, api)
      .map((asset) => asset.value)
      .reduce((prev, curr) => {
        return prev.add(curr);
      }, new BN(0));
  };

  const value = {
    spendableAssets: spendableAssets,
    getSpendableAssetsByAssetId: getSpendableAssetsByAssetId,
    saveSpendableAssets: saveSpendableAssets,
    saveSpendableAsset: saveSpendableAsset,
    removeSpendableAsset: removeSpendableAsset,
    getSpendableBalance: getSpendableBalance,
  };

  return (
    <WalletContext.Provider value={value}>
      {props.children}
    </WalletContext.Provider>
  );
};

WalletContext.propTypes = {
  children: PropTypes.any,
};

export const useWallet = () => ({ ...useContext(WalletContext) });
