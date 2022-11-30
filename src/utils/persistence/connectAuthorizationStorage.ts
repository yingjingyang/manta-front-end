// @ts-nocheck
import store from 'store';

const HAS_AUTH_TO_CONNECT_POLKADOT_KEY = 'hasAuthToConnectPolkadot';
const HAS_AUTH_TO_CONNECT_TALISMAN_KEY = 'hasAuthToConnectTalisman';
const HAS_AUTH_TO_CONNECT_SUBWALLET_KEY = 'hasAuthToConnectSubwallet';
const HAS_AUTH_TO_CONNECT_METAMASK_KEY = 'hasAuthToConnectMetamask';

export const setHasAuthToConnectMetamaskStorage = (isAuthorized) => {
  store.set(HAS_AUTH_TO_CONNECT_METAMASK_KEY, isAuthorized);
};

export const getHasAuthToConnectMetamaskStorage = () => {
  return store.get(HAS_AUTH_TO_CONNECT_METAMASK_KEY, false);
};

export const setHasAuthToConnectTalismanStorage = (isAuthorized) => {
  store.set(HAS_AUTH_TO_CONNECT_TALISMAN_KEY, isAuthorized);
};

export const getHasAuthToConnectTalismanStorage = () => {
  return store.get(HAS_AUTH_TO_CONNECT_TALISMAN_KEY, false);
};

export const setHasAuthToConnectSubwalletStorage = (isAuthorized) => {
  store.set(HAS_AUTH_TO_CONNECT_SUBWALLET_KEY, isAuthorized);
};

export const getHasAuthToConnectSubwalletStorage = () => {
  return store.get(HAS_AUTH_TO_CONNECT_SUBWALLET_KEY, false);
};

export const setHasAuthToConnectPolkadotStorage = (isAuthorized) => {
  store.set(HAS_AUTH_TO_CONNECT_POLKADOT_KEY, isAuthorized);
};

export const getHasAuthToConnectPolkadotStorage = () => {
  return store.get(HAS_AUTH_TO_CONNECT_POLKADOT_KEY, false);
};