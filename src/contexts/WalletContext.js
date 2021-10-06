import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { BN } from 'bn.js';
import {
  loadSpendableAssetsFromStorage,
  persistSpendableAssetsToStorage,
} from 'utils/persistence/AssetStorage';

const WalletContext = createContext();

export const WalletContextProvider = (props) => {
  const [spendableAssets, setSpendableAssets] = useState(null);

  useEffect(() => {
    if (spendableAssets === null) {
      setSpendableAssets(loadSpendableAssetsFromStorage());
    }
  });

  const getSpendableAssetsByAssetId = (assetId) => {
    return spendableAssets.filter((asset) => asset.assetId === assetId);
  };

  const removeSpendableAsset = (assetToRemove) => {
    const newSpendableAssets = spendableAssets.filter(
      (asset) => !_.isEqual(asset, assetToRemove)
    );
    setSpendableAssets(newSpendableAssets);
    persistSpendableAssetsToStorage(newSpendableAssets);
  };

  const saveSpendableAssets = (spendableAssets) => {
    setSpendableAssets(spendableAssets);
    persistSpendableAssetsToStorage(spendableAssets);
  };

  const saveSpendableAsset = (newSpendableAsset) => {
    const newSpendableAssets = [...spendableAssets, newSpendableAsset];
    setSpendableAssets(newSpendableAssets);
    persistSpendableAssetsToStorage(newSpendableAssets);
  };

  const getSpendableBalance = (assetId) => {
    return getSpendableAssetsByAssetId(assetId)
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
