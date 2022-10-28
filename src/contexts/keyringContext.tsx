// @ts-nocheck
import APP_NAME from 'constants/AppConstants';
import PropTypes from 'prop-types';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getHasAuthToConnectStorage } from 'utils/persistence/connectAuthorizationStorage';
import { web3Accounts, web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp';
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

  const subscribeWeb3Accounts = async () => {
    let unsubscribe = await web3AccountsSubscribe(async () => {
      const updatedAccounts = await web3Accounts();
      const updatedAddresses = [];

      //add newly created account into keyring
      updatedAccounts.forEach(({ address, meta }) => {
        updatedAddresses.push(address);
        if (!keyringAddresses.includes(address)) {
          keyring.loadInjected(address, { ...meta, name: meta.name });
        }
      });

      //remove newly deleted account from keyring
      keyringAddresses.forEach((oldAddress) => {
        if (!updatedAddresses.includes(oldAddress)) {
          keyring.forgetAccount(oldAddress);
        }
      });
      // (boyuan)todo: was triggering update everytime because object address change
      setKeyringAddresses(updatedAddresses);
    });
    return unsubscribe;
  };

  const triggerInitKeyringWhenWeb3ExtensionsInjected = async () => {
    if (!isKeyringInit) {
      if (window.injectedWeb3 && Object.getOwnPropertyNames(window.injectedWeb3).length !== 0) {
        setWeb3ExtensionInjected(Object.getOwnPropertyNames(window.injectedWeb3));
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

  // hasAuthToConnectWallet equals true when user previously connected wallet
  useEffect(() => {
    return initKeyring();
  }, [hasAuthToConnectWallet]);

  useEffect(() => {
    triggerInitKeyringWhenWeb3ExtensionsInjected();
  }, [waitExtensionCounter]);

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
