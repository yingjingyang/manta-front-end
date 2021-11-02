import store from 'store';
const SPENDABLE_ASSETS_STORAGE_KEY = 'mantaSpendableAssets';

export const loadSpendableAssetsFromStorage = (api) => {
  const assetsStorage = store.get(SPENDABLE_ASSETS_STORAGE_KEY) || [];
  return assetsStorage.map((bytes) =>
    api.createType('MantaSignerInputAsset', bytes)
  );
};

export const persistSpendableAssetsToStorage = (spendableAssets, api) => {
  const serializedAssets = spendableAssets.map((asset) => asset.toU8a(api));
  store.set(SPENDABLE_ASSETS_STORAGE_KEY, serializedAssets);
};
