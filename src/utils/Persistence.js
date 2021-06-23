import store from 'store';
import MantaAsset from '../dtos/MantaAsset';
import BN from 'bn.js';

const SPENDABLE_ASSETS_STORAGE_KEY = 'manta_spendable_assets';

export const loadSpendableAssets = () => {
  const assetsStorage = store.get(SPENDABLE_ASSETS_STORAGE_KEY) || [];
  return assetsStorage
    .map(asset => MantaAsset.fromStorage(asset));
};

export const loadSpendableAssetsById = assetId => {
  return loadSpendableAssets()
    .filter(asset => asset.assetId.eq(assetId));
};

export const persistSpendableAssets = spendableAssets => {
  const serializedAssets = spendableAssets.map(asset => asset.serialize());
  store.set(SPENDABLE_ASSETS_STORAGE_KEY, serializedAssets);
};

export const loadSpendableBalances = () => {
  const balanceByAssetId = {};
  loadSpendableAssets().forEach(asset => {
    const currentValue = balanceByAssetId[asset.assetId]
      ? balanceByAssetId[asset.assetId]
      : new BN(0);
    balanceByAssetId[asset.assetId] = currentValue.add(asset.privInfo.value);
  });
  return balanceByAssetId;
};
