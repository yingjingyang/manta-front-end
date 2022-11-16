// @ts-nocheck
import APP_NAME from 'constants/AppConstants';
import PropTypes from 'prop-types';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getHasAuthToConnectStorage } from 'utils/persistence/connectAuthorizationStorage';
import {
  web3Accounts,
  web3AccountsSubscribe,
  web3Enable
} from '@polkadot/extension-dapp';
import {
  getSavedKeyringAddresses,
  setSavedKeyringAddresses
} from 'utils/persistence/externalAccountStorage';
import keyring from '@polkadot/ui-keyring';
import { useConfig } from './configContext';
import { getWallets } from '@talismn/connect-wallets';

const KeyringContext = createContext();

export const KeyringContextProvider = (props) => {
  const config = useConfig();
  const [waitExtensionCounter, setWaitExtensionCounter] = useState(0);
  const [isKeyringInit, setIsKeyringInit] = useState(false);
  const [keyringAddresses, setKeyringAddresses] = useState([]);
  const [web3ExtensionInjected, setWeb3ExtensionInjected] = useState([]);
  const [hasAuthToConnectWallet, setHasAuthToConnectWallet] = useState(
    getHasAuthToConnectStorage()
  );
  const [selectedWallet, setSelectedWallet] = useState(null);

  const [hasAuthToConnectPolkadot, setHasAuthToConnectPolkadot] =
    useState(false);
  const [hasAuthToConnectTalisman, setHasAuthToConnectTalisman] =
    useState(false);
  const [hasAuthToConnectSubwallet, setHasAuthToConnectSubwallet] =
    useState(false);

  const connectWalletExtension = (extensionName) => {
    if (extensionName === 'talisman') {
      setHasAuthToConnectTalisman(true);
    } else if (extensionName === 'polkadot-js') {
      setHasAuthToConnectPolkadot(true);
    } else if (extensionName === 'subwallet-js') {
      setHasAuthToConnectSubwallet(true);
    }
  };

  const subscribeWalletAccounts = async (wallet) => {
    let unsubscribe = () => {};
    if (wallet) {
      wallet.enable(APP_NAME).then(() => {
        unsubscribe = wallet.subscribeAccounts(async (accounts) => {
          const currentKeyringAddresses = keyring.getAccounts().map((account)=>account.address)
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
          // (boyuan)todo: was triggering update everytime because object address change
          setSelectedWallet(wallet);
          setSavedKeyringAddresses(config, updatedAddresses)
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
          if (waitExtensionCounter < 5) {
            setWaitExtensionCounter((counter) => counter + 1);
          }
        }, 500);
      } else {
        setTimeout(async () => {
          if (waitExtensionCounter < 5) {
            setWaitExtensionCounter((counter) => counter + 1);
          }
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
    }
    return unsubscribe;
  };

  useEffect(() => {
    return initKeyring();
  }, [hasAuthToConnectWallet]);

  useEffect(() => {
    triggerInitKeyringWhenWeb3ExtensionsInjected();
  }, [waitExtensionCounter]);

  useEffect(() => {
    const substrateWallets = getWallets();
    const talismanWallet = substrateWallets.find(
      (wallet) => wallet.extensionName === 'talisman'
    );
    const polkadotWallet = substrateWallets.find(
      (wallet) => wallet.extensionName === 'polkadot-js'
    );
    const subwalletWallet = substrateWallets.find(
      (wallet) => wallet.extensionName === 'subwallet-js'
    );

    if (hasAuthToConnectTalisman && !talismanWallet.extension) {
      talismanWallet
        .enable(APP_NAME)
        .then(() => subscribeWalletAccounts(talismanWallet));
    } else if (hasAuthToConnectPolkadot && !polkadotWallet.extension) {
      polkadotWallet
        .enable(APP_NAME)
        .then(() => subscribeWalletAccounts(polkadotWallet));
    } else if (hasAuthToConnectSubwallet && !subwalletWallet.extension) {
      subwalletWallet
        .enable(APP_NAME)
        .then(() => subscribeWalletAccounts(subwalletWallet));
    }
  }, [
    hasAuthToConnectTalisman,
    hasAuthToConnectPolkadot,
    hasAuthToConnectSubwallet
  ]);

  const value = {
    keyring: keyring, // keyring object would not change even if properties changed
    isKeyringInit: isKeyringInit,
    keyringAddresses: keyringAddresses, //keyring object would not change so use keyringAddresses to trigger re-render
    setHasAuthToConnectWallet: setHasAuthToConnectWallet,
    web3ExtensionInjected: web3ExtensionInjected,
    connectWalletExtension: connectWalletExtension,
    subscribeWalletAccounts: subscribeWalletAccounts,
    selectedWallet: selectedWallet
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
