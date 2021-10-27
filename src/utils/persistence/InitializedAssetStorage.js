import store from 'store';

const INITIALIZED_ASSET_STORAGE_KEY = 'mantaInitializedAssets';

const loadInitializedAssets = () => {
  return store.get(INITIALIZED_ASSET_STORAGE_KEY) || [];
};

export const assetIsInitialized = (assetId) => {
  return (
    loadInitializedAssets().filter(
      (initializedAssetId) => initializedAssetId === assetId
    ).length === 1
  );
};

export const saveInitializedAsset = (assetId) => {
  const initializedAssets = loadInitializedAssets();
  initializedAssets.push(assetId);
  store.set(INITIALIZED_ASSET_STORAGE_KEY, initializedAssets);
};
