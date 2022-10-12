//@ts-nocheck
// @ts-nocheck
import APP_NAME from 'constants/AppConstants';
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react';
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
  const [web3ExtensionInjected, setWeb3ExtensionInjected] = useState({});
  const [hasAuthToConnectWallet, setHasAuthToConnectWallet] = useState(!!window.localStorage.getItem('isWalletConnected'));
  
  const isKeyringLoaded = () => {
    try {
      return isKeyringInit;
    } catch (e) {
      console.log(`encounter error: ${e} while isKeyringLoaded`);
      return false;
    }
  };


  const updateWeb3ExtensionInjected = () => {
    try {
      if (window.injectedWeb3) {
        setWeb3ExtensionInjected(window.injectedWeb3);
      }
      else {
        if (waitExtensionCounter < 5) {
          setTimeout(() => {
            setWaitExtensionCounter(counter => counter + 1);
          }, 1000);
        }
      }
    } catch (e) {
      console.log(`encounter error: ${e} while updateWeb3ExtensionInjected`);
    }
  };

  let unsubscribe;
  const initKeyring = async () => {
    await web3Enable(APP_NAME);
    keyring.loadAll(
      {
        ss58Format: config.SS58_FORMAT,
        isDevelopment: config.DEVELOPMENT_KEYRING
      },
      [],
    );
    setIsKeyringInit(true);
    unsubscribe = await web3AccountsSubscribe((accounts) => {
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
          keyring.loadInjected(address, {...meta, name: meta.name}, type);
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
  }; 


  useEffect(() => {
    if (hasAuthToConnectWallet && !isKeyringLoaded() && Object.keys(web3ExtensionInjected).length !== 0){
      initKeyring();
      return () => { unsubscribe && unsubscribe(); }; 
    }
  }, [web3ExtensionInjected, hasAuthToConnectWallet]);

  useEffect(() => {
    updateWeb3ExtensionInjected();
  }, [waitExtensionCounter]);


  const value = {
    keyring: keyring, // keyring object would not change even if properties changed
    isKeyringLoaded: isKeyringLoaded,
    keyringAddresses: keyringAddresses, //keyring object would not change so use keyringAddresses to trigger re-render
    setHasAuthToConnectWallet: setHasAuthToConnectWallet,
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
