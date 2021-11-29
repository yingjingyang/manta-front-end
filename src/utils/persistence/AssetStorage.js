import store from 'store';
import { ClientAsset } from 'signer-interface';
const SPENDABLE_ASSETS_STORAGE_KEY = 'mantaSpendableAssets';

export const loadSpendableAssetsFromStorage = (api) => {
  const assetsStorage = store.get(SPENDABLE_ASSETS_STORAGE_KEY) || [];
  return assetsStorage
    .map((bytes) => api.createType('MantaSignerInputAsset', bytes))
    .map((signerAsset) => ClientAsset.fromSignerAsset(signerAsset));
};

export const persistSpendableAssetsToStorage = (spendableAssets, api) => {
  const serializedAssets = spendableAssets.map((asset) => asset.toU8a(api));
  store.set(SPENDABLE_ASSETS_STORAGE_KEY, serializedAssets);
};
