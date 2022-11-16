// @ts-nocheck
import store from 'store';

const LAST_ACCOUNT_STORAGE_KEY = 'lastAccessedExternalAccountAddress';
const SAVED_KEYRING_ADDRESSES = 'savedKeyringAddresses'

export const getLastAccessedExternalAccount = (config, keyring) => {
  const lastAccountAddress = store.get(
    `${config.BASE_STORAGE_KEY}${LAST_ACCOUNT_STORAGE_KEY}`
  );

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

export const setLastAccessedExternalAccountAddress = (config, lastAccount) => {
  store.set(
    `${config.BASE_STORAGE_KEY}${LAST_ACCOUNT_STORAGE_KEY}`,
    lastAccount
  );
};

// setter & getter for saved addresses of last externalAccountOptions 
export const getSavedKeyringAddresses = (config) => {
  return store.get(
    `${config.BASE_STORAGE_KEY}${SAVED_KEYRING_ADDRESSES}`
  )
};

export const setSavedKeyringAddresses = (config, keyringAddresses) => {
  store.set(
    `${config.BASE_STORAGE_KEY}${SAVED_KEYRING_ADDRESSES}`,
    keyringAddresses
  );
};
