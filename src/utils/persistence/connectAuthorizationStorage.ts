// @ts-nocheck
import store from 'store';

const HAS_AUTH_TO_CONNECT_WALLET_KEY = 'hasAuthToConnectWallet';

export const setHasAuthToConnectStorage = (isAuthorized) => {
  store.set(HAS_AUTH_TO_CONNECT_WALLET_KEY, isAuthorized);
};

export const getHasAuthToConnectStorage = () => {
  return store.get(HAS_AUTH_TO_CONNECT_WALLET_KEY, false);
};
