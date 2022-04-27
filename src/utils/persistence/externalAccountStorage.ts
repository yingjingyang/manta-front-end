// @ts-nocheck
import store from 'store';
import config from 'config';

const LAST_ACCOUNT_STORAGE_KEY = 'lastAccessedExternalAccountAddress';

export const getLastAccessedExternalAccount = (keyring) => {
  const lastAccountAddress = store.get(
    `${config.BASE_STORAGE_KEY}${LAST_ACCOUNT_STORAGE_KEY}`);

  if (!lastAccountAddress) {
    return null;
  }
  // Validate that account is still in user's keychain
  try {
    return keyring.getPair(lastAccountAddress);
  } catch (error) {
    return null;
  }
};

export const setLastAccessedExternalAccountAddress = (lastAccount) => {
  store.set(
    `${config.BASE_STORAGE_KEY}${LAST_ACCOUNT_STORAGE_KEY}`, lastAccount);
};
