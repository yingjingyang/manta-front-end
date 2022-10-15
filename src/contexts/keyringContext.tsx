// @ts-nocheck
import APP_NAME from 'constants/AppConstants';
import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import keyring from '@polkadot/ui-keyring';
import { web3Enable, web3AccountsSubscribe } from '@polkadot/extension-dapp';
import { useConfig } from './configContext';

const KeyringContext = createContext();

export const KeyringContextProvider = (props) => {
  const config = useConfig();
  const [waitExtensionCounter, setWaitExtensionCounter] = useState(0);
  const [isKeyringInit, setIsKeyringInit] = useState(false);
  const [keyringAddresses, setKeyringAddresses] = useState([]);
  const [web3ExtensionInjected, setWeb3ExtensionInjected] = useState([]);
  const [hasAuthToConnectWallet, setHasAuthToConnectWallet] = useState(!!window.localStorage.getItem('hasAuthToConnectWallet'));
  const [timeCounter, setTimeCounter] = useState(0);

  const isKeyringLoaded = () => {
    try {
      return isKeyringInit;
    } catch (e) {
      console.log(`encounter error: ${e} while isKeyringLoaded`);
      return false;
    }
  };

  const subscribeWeb3Accounts = async () => {
    let unsubscribe = await web3AccountsSubscribe((accounts) => {
      const newAddresses = [];
      const oldAddresses = [];

      //populate existingAddresses with not updated accounts' addresses
      keyring.getAccounts().map(({ address }) => {
        oldAddresses.push(address);
      });

      //add newly created account into keyring
      accounts.map(({ address, meta, type }) => {
        newAddresses.push(address);
        if (!oldAddresses.includes(address)) {
          keyring.loadInjected(address, { ...meta, name: meta.name }, type);
        }
      });

      //remove newly deleted account from keyring
      oldAddresses.map((address) => {
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
    try {
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
        if (
          newWeb3ExtensionInjected.length === 0 ||
          newWeb3ExtensionInjected !== 0
        ) {
          if (isKeyringLoaded()) {
            unsubscribe = subscribeWeb3Accounts();
          }
        }
        setWeb3ExtensionInjected(newWeb3ExtensionInjected);
      }
      return unsubscribe;
    } catch (e) {
      console.log(`detectNewInjectedAccounts error : ${e}`);
      return unsubscribe;
    }
  };

  const initKeyringWhenWeb3ExtensionsInjected = async () => {
    try {
      const extensionNames = Object.getOwnPropertyNames(window.injectedWeb3);
      if (!isKeyringLoaded()) {
        if (window.injectedWeb3 && extensionNames.length !== 0) {
          setWeb3ExtensionInjected(extensionNames);
          setTimeout(async () => {
            await initKeyring();
            setWaitExtensionCounter((counter) => counter + 1);
          }, 1000);
        } else {
          setTimeout(async () => {
            setWaitExtensionCounter((counter) => counter + 1);
          }, 1000);
        }
      }
    } catch (e) {
      console.log(`encounter error: ${e} while updateWeb3ExtensionInjected`);
    }
  };

  const initKeyring = async () => {
    let unsubscribe = () => {};
    if (
      hasAuthToConnectWallet &&
      !isKeyringLoaded() &&
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

    arrOne.map((item) => {
      if (!arrTwo.includes(item)) {
        return false;
      }
    });
    arrTwo.map((item) => {
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
    initKeyringWhenWeb3ExtensionsInjected();
  }, [waitExtensionCounter]);

  // continuously detect new injected accounts
  useEffect(() => {
    setTimeout(() => {
      try {
        detectNewInjectedAccounts();
      } catch (e) {
        console.error(e);
      }
      setTimeCounter((timeCounter) => timeCounter + 1);
    }, 10000);
  }, [timeCounter]);

  const value = {
    keyring: keyring, // keyring object would not change even if properties changed
    isKeyringLoaded: isKeyringLoaded,
    keyringAddresses: keyringAddresses, //keyring object would not change so use keyringAddresses to trigger re-render
    setHasAuthToConnectWallet: setHasAuthToConnectWallet,
    web3ExtensionInjected: web3ExtensionInjected,
    detectNewInjectedAccounts: detectNewInjectedAccounts
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
