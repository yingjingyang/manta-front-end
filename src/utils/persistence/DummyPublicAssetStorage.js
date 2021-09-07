import store from 'store';
import BN from 'bn.js';

const DUMMY_PUBLIC_ASSET_BALANCE_STORAGE_KEY = 'dummyPublicAssetBalance';
export const DUMMY_ASSET_BALANCE = 100000;

export const loadPublicAssetBalance = (assetId) => {
  return new BN(
    store.get(DUMMY_PUBLIC_ASSET_BALANCE_STORAGE_KEY, {})[assetId] ||
      DUMMY_ASSET_BALANCE
  );
};

export const savePublicAssetBalance = (assetId, balance) => {
  const assetBalances = store.get(DUMMY_PUBLIC_ASSET_BALANCE_STORAGE_KEY, {});
  assetBalances[assetId] = balance.toNumber();
  store.set(DUMMY_PUBLIC_ASSET_BALANCE_STORAGE_KEY, assetBalances);
};
