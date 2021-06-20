import store from 'store';
import MantaAsset from '../dtos/MantaAsset';
import _ from 'lodash';


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
  let serializedAssets = spendableAssets.map(asset => asset.serialize())
  store.set(SPENDABLE_ASSETS_STORAGE_KEY, serializedAssets);
};
