// @ts-nocheck
import APP_NAME from 'constants/AppConstants';
import WALLET_NAME from 'constants/WalletConstants';
import PropTypes from 'prop-types';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getHasAuthToConnectPolkadotStorage,
  getHasAuthToConnectTalismanStorage,
  getHasAuthToConnectSubwalletStorage,
  setHasAuthToConnectPolkadotStorage,
  setHasAuthToConnectTalismanStorage,
  setHasAuthToConnectSubwalletStorage
} from 'utils/persistence/connectAuthorizationStorage';
import keyring from '@polkadot/ui-keyring';
import { useConfig } from './configContext';
import { getWallets } from '@talismn/connect-wallets';

const KeyringContext = createContext();
const MAX_WAIT_COUNT = 5;

export const KeyringContextProvider = (props) => {
  const config = useConfig();
  const [waitExtensionCounter, setWaitExtensionCounter] = useState(0);
  const [isKeyringInit, setIsKeyringInit] = useState(false);
  const [keyringAddresses, setKeyringAddresses] = useState([]);
  const [web3ExtensionInjected, setWeb3ExtensionInjected] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);

  const [hasAuthToConnectPolkadot, setHasAuthToConnectPolkadot] = useState(
    getHasAuthToConnectPolkadotStorage()
  );
  const [hasAuthToConnectTalisman, setHasAuthToConnectTalisman] = useState(
    getHasAuthToConnectTalismanStorage()
  );
  const [hasAuthToConnectSubwallet, setHasAuthToConnectSubwallet] = useState(
    getHasAuthToConnectSubwalletStorage()
  );

  const hasAuthToConnectAnyWallet =
    hasAuthToConnectPolkadot ||
    hasAuthToConnectTalisman ||
    hasAuthToConnectSubwallet;

  const connectWalletExtension = (extensionName) => {
    if (extensionName === WALLET_NAME.TALISMAN) {
      setHasAuthToConnectTalismanStorage(true);
      setHasAuthToConnectTalisman(true);
    } else if (extensionName === WALLET_NAME.POLKADOT) {
      setHasAuthToConnectPolkadotStorage(true);
      setHasAuthToConnectPolkadot(true);
    } else if (extensionName === WALLET_NAME.SUBWALLET) {
      setHasAuthToConnectSubwalletStorage(true);
      setHasAuthToConnectSubwallet(true);
    }
  };

  const subscribeWalletAccounts = async (wallet) => {
    let unsubscribe = () => {};
    if (wallet) {
      wallet.enable(APP_NAME).then(() => {
        unsubscribe = wallet.subscribeAccounts(async (accounts) => {
          const currentKeyringAddresses = keyring
            .getAccounts()
            .map((account) => account.address);
          const updatedAccounts = await wallet.getAccounts();
          const updatedAddresses = [];

          // add newly created account into keyring
          updatedAccounts.forEach((account) => {
            updatedAddresses.push(account.address);
            if (!currentKeyringAddresses.includes(account.address)) {
              keyring.loadInjected(account.address, { ...account });
            }
          });

          // remove newly deleted account from keyring
          currentKeyringAddresses.forEach((oldAddress) => {
            if (!updatedAddresses.includes(oldAddress)) {
              keyring.forgetAccount(oldAddress);
            }
          });
          setSelectedWallet(wallet);
          setKeyringAddresses(updatedAddresses);
        });
      });
    }
    return unsubscribe;
  };

  const triggerInitKeyringWhenWeb3ExtensionsInjected = async () => {
    if (!isKeyringInit) {
      if (
        window.injectedWeb3 &&
        Object.getOwnPropertyNames(window.injectedWeb3).length !== 0
      ) {
        setWeb3ExtensionInjected(
          Object.getOwnPropertyNames(window.injectedWeb3)
        );
        setTimeout(async () => {
          await initKeyring();
          if (waitExtensionCounter < MAX_WAIT_COUNT) {
            setWaitExtensionCounter((counter) => counter + 1);
          }
        }, 500);
      } else {
        setTimeout(async () => {
          if (waitExtensionCounter < MAX_WAIT_COUNT) {
            setWaitExtensionCounter((counter) => counter + 1);
          }
        }, 500);
      }
    }
  };

  const initKeyring = async () => {
    let unsubscribe = () => {};
    if (
      hasAuthToConnectAnyWallet &&
      !isKeyringInit &&
      web3ExtensionInjected.length !== 0
    ) {
      keyring.loadAll(
        {
          ss58Format: config.SS58_FORMAT
        },
        []
      );
      setIsKeyringInit(true);
    }
    return unsubscribe;
  };

  useEffect(() => {
    return initKeyring();
  }, [hasAuthToConnectAnyWallet]);

  useEffect(() => {
    triggerInitKeyringWhenWeb3ExtensionsInjected();
  }, [waitExtensionCounter]);

  const connectWallet = async (extensionName) => {
    if (!isKeyringInit) {
      return;
    }
    const substrateWallets = getWallets();
    const selectedWallet = substrateWallets.find(
      (wallet) => wallet.extensionName === extensionName
    );
    if (!selectedWallet.extension) {
      try {
        await selectedWallet?.enable(APP_NAME);
        subscribeWalletAccounts(selectedWallet);
      } catch (e) {
        console.log(e);
        if (extensionName === WALLET_NAME.POLKADOT) {
          setHasAuthToConnectPolkadotStorage(false);
          setHasAuthToConnectPolkadot(false);
        } else if (extensionName === WALLET_NAME.SUBWALLET) {
          setHasAuthToConnectSubwalletStorage(false);
          setHasAuthToConnectSubwallet(false);
        } else if (extensionName === WALLET_NAME.TALISMAN) {
          setHasAuthToConnectTalismanStorage(false);
          setHasAuthToConnectTalisman(false);
        }
      }
    }
  };

  useEffect(() => {
    if (!isKeyringInit) {
      return;
    }
    if (hasAuthToConnectSubwallet) {
      connectWallet(WALLET_NAME.SUBWALLET);
    }

    if (hasAuthToConnectTalisman) {
      connectWallet(WALLET_NAME.TALISMAN);
    }

    if (hasAuthToConnectPolkadot) {
      connectWallet(WALLET_NAME.POLKADOT);
    }
  }, [isKeyringInit]);

  const value = {
    keyring: keyring, // keyring object would not change even if properties changed
    isKeyringInit: isKeyringInit,
    keyringAddresses: keyringAddresses, //keyring object would not change so use keyringAddresses to trigger re-render
    web3ExtensionInjected: web3ExtensionInjected,
    connectWalletExtension: connectWalletExtension,
    subscribeWalletAccounts: subscribeWalletAccounts,
    selectedWallet: selectedWallet,
    connectWallet: connectWallet
  };

  return (
    <KeyringContext.Provider value={value}>
      {props.children}
    </KeyringContext.Provider>
  );
};

KeyringContextProvider.propTypes = {
  children: PropTypes.any
};

export const useKeyring = () => ({ ...useContext(KeyringContext) });
