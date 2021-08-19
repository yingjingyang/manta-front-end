import store from 'store';
import BN from 'bn.js';
import _ from 'lodash';
import MantaUIAsset from '../../types/MantaUIAsset';

const SPENDABLE_ASSETS_STORAGE_KEY = 'manta_spendable_assets';

export const loadSpendableAssets = () => {
  const assetsStorage = store.get(SPENDABLE_ASSETS_STORAGE_KEY) || [];
  return assetsStorage
    .map(asset => MantaUIAsset.fromStorage(asset));
};

export const loadSpendableAssetsById = assetId => {
  return loadSpendableAssets()
    .filter(asset => asset.assetId === assetId);
};

export const removeSpendableAsset = assetToRemove => {
  const spendableAssets = loadSpendableAssets()
    .filter(asset => !_.isEqual(asset, assetToRemove));
  persistSpendableAssets(spendableAssets);
};

export const persistSpendableAssets = spendableAssets => {
  const serializedAssets = spendableAssets.map(asset => asset.serialize());
  store.set(SPENDABLE_ASSETS_STORAGE_KEY, serializedAssets);
};

export const persistSpendableAsset = spendableAsset => {
  const spendableAssets = loadSpendableAssets();
  spendableAssets.push(spendableAsset);
  persistSpendableAssets(spendableAssets);
};

export const loadSpendableBalances = () => {
  const balanceByAssetId = {};
  loadSpendableAssets().forEach(asset => {
    const currentValue = balanceByAssetId[asset.assetId]
      ? balanceByAssetId[asset.assetId]
      : new BN(0);
    balanceByAssetId[asset.assetId] = currentValue.add(asset.value);
  });
  return balanceByAssetId;
};

export const loadSpendableBalance = assetId => {
  return loadSpendableBalances()[assetId] || new BN(0);
};
