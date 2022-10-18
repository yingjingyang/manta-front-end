// @ts-nocheck
import APP_NAME from 'constants/AppConstants';
import PropTypes from 'prop-types';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getHasAuthToConnectStorage } from 'utils/persistence/connectAuthorizationStorage';

import { web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';

import { useConfig } from './configContext';

const KeyringContext = createContext();

export const KeyringContextProvider = (props) => {
  const config = useConfig();
  const [waitExtensionCounter, setWaitExtensionCounter] = useState(0);
  const [isKeyringInit, setIsKeyringInit] = useState(false);
  const [keyringAddresses, setKeyringAddresses] = useState([]);
  const [web3ExtensionInjected, setWeb3ExtensionInjected] = useState([]);
  const [hasAuthToConnectWallet, setHasAuthToConnectWallet] = useState(getHasAuthToConnectStorage());
  const [timeCounter, setTimeCounter] = useState(0);

  const subscribeWeb3Accounts = async () => {
    let unsubscribe = await web3AccountsSubscribe((accounts) => {
      const newAddresses = [];

      //populate existingAddresses with not updated accounts' addresses
      const oldAddresses = keyring.getPairs().map(pair => pair.address)

      //add newly created account into keyring
      accounts.forEach(({ address, meta, type }) => {
        newAddresses.push(address);
        if (!oldAddresses.includes(address)) {
          keyring.loadInjected(address, { ...meta, name: meta.name }, type);
        }
      });

      //remove newly deleted account from keyring
      oldAddresses.forEach((address) => {
        if (!newAddresses.includes(address)) {
          keyring.forgetAccount(address);
        }
      });
      setKeyringAddresses(newAddresses);
    });
    return unsubscribe;
  };

  const detectNewInjectedAccounts = async () => {
    let unsubscribe = () => {};
    let isEqual = false;
    let newWeb3ExtensionInjected = [];
    const extensions = await web3Enable(APP_NAME);

    for (let i = 0; i < extensions.length; i++) {
      newWeb3ExtensionInjected.push(extensions[i].name);
    }

    isEqual = isTwoStringArrayEqual(
      web3ExtensionInjected,
      newWeb3ExtensionInjected
    );
    if (!isEqual) {
      // check whether user disabled a existing extension
      if (isKeyringInit) {
        unsubscribe = await subscribeWeb3Accounts();
      }
      setWeb3ExtensionInjected(newWeb3ExtensionInjected);
    }
    return unsubscribe;
  };

  const triggerInitKeyringWhenWeb3ExtensionsInjected = async () => {
    const extensionNames = Object.getOwnPropertyNames(window.injectedWeb3);
    if (!isKeyringInit) {
      if (window.injectedWeb3 && extensionNames.length !== 0) {
        setWeb3ExtensionInjected(extensionNames);
        setTimeout(async () => {
          await initKeyring();
          setWaitExtensionCounter((counter) => counter + 1);
        }, 500);
      } else {
        setTimeout(async () => {
          setWaitExtensionCounter((counter) => counter + 1);
        }, 500);
      }
    }
  };

  const initKeyring = async () => {
    let unsubscribe = () => {};
    if (
      hasAuthToConnectWallet &&
      !isKeyringInit &&
      web3ExtensionInjected.length !== 0
    ) {
      keyring.loadAll(
        {
          ss58Format: config.SS58_FORMAT,
          isDevelopment: config.DEVELOPMENT_KEYRING
        },
        []
      );
      setIsKeyringInit(true);
      await web3Enable(APP_NAME);
      unsubscribe = await subscribeWeb3Accounts();
    }
    return unsubscribe;
  };

  const isTwoStringArrayEqual = (arrOne, arrTwo) => {
    if (arrOne.length !== arrTwo.length) {
      return false;
    }

    arrOne.forEach(item => {
      if (!arrTwo.includes(item)) {
        return false;
      }
    });
    arrTwo.forEach(item => {
      if (!arrOne.includes(item)) {
        return false;
      }
    });
    return true;
  };

  // hasAuthToConnectWallet equals true when user previously connected wallet
  useEffect(() => {
    return initKeyring();
  }, [hasAuthToConnectWallet]);

  useEffect(() => {
    triggerInitKeyringWhenWeb3ExtensionsInjected();
  }, [waitExtensionCounter]);

  // continuously detect new injected accounts
  useEffect(() => {
    setTimeout(() => {
      detectNewInjectedAccounts();
      setTimeCounter((timeCounter) => timeCounter + 1);
    }, 10000);
  }, [timeCounter]);

  const value = {
    keyring: keyring, // keyring object would not change even if properties changed
    isKeyringInit: isKeyringInit,
    keyringAddresses: keyringAddresses, //keyring object would not change so use keyringAddresses to trigger re-render
    setHasAuthToConnectWallet: setHasAuthToConnectWallet,
    web3ExtensionInjected: web3ExtensionInjected,
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
