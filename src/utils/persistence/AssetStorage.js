import store from 'store';
import { ClientAsset } from 'signer-interface';
import config from 'config';
const SPENDABLE_ASSETS_STORAGE_KEY = 'spendableAssets';

export const loadSpendableAssetsFromStorage = (api) => {
  const assetsStorage = store.get(
    `${config.BASE_STORAGE_KEY}${SPENDABLE_ASSETS_STORAGE_KEY}`
  ) || [];
  return assetsStorage
    .map((bytes) => api.createType('MantaSignerInputAsset', bytes))
    .map((signerAsset) => ClientAsset.fromSignerAsset(signerAsset));
};

export const persistSpendableAssetsToStorage = (spendableAssets, api) => {
  const serializedAssets = spendableAssets.map((asset) => asset.toU8a(api));
  store.set(
    `${config.BASE_STORAGE_KEY}${SPENDABLE_ASSETS_STORAGE_KEY}`,
    serializedAssets
  );
};
