import store from 'store';
const SPENDABLE_ASSETS_STORAGE_KEY = 'manta_spendable_assets';

export const loadSpendableAssetsFromStorage = (api) => {
  const assetsStorage = store.get(SPENDABLE_ASSETS_STORAGE_KEY) || [];
  return assetsStorage.map((bytes) =>
    api.createType('MantaSignerInputAsset', bytes)
  );
};

export const persistSpendableAssetsToStorage = (spendableAssets) => {
  const serializedAssets = spendableAssets.map((asset) => asset.toU8a());
  store.set(SPENDABLE_ASSETS_STORAGE_KEY, serializedAssets);
};
