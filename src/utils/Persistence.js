import store from 'store';
import MantaAsset from '../dtos/MantaAsset';

const SPENDABLE_ASSETS_STORAGE_KEY = 'manta_spendable_assets';

export const loadSpendableAssets = () => {
  const assetsStorage = store.get(SPENDABLE_ASSETS_STORAGE_KEY) || [];
  return assetsStorage
    .map(asset => new Uint8Array(Object.values(asset)));
};

export const loadSpendableAssetsById = assetId => {
    return loadSpendableAssets()
        .filter(asset => {
            return new MantaAsset(asset).assetId.toNumber() === parseInt(assetId) });
};

export const persistSpendableAssets = spendableAssets => {
  store.set(SPENDABLE_ASSETS_STORAGE_KEY, spendableAssets);
};
