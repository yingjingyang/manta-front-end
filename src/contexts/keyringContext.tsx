// @ts-nocheck
import APP_NAME from 'constants/AppConstants';
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import uiKeyring from '@polkadot/ui-keyring';
import { web3Enable, web3AccountsSubscribe } from '@polkadot/extension-dapp';
import { useConfig } from './configContext';

const KeyringContext = createContext();

export const KeyringContextProvider = (props) => {
  const config = useConfig();
  const [keyringLength, setKeyringLength] = useState(0);
  const [keyring, setKeyring] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(!!window.localStorage.getItem('window.localStorage'));
  let unsubscribe;
  console.log('re-rendered');
  useEffect(() => {
    const IsWalletInjected = () => {
      return !!window.injectedWeb3['polkadot-js'] || !!window.injectedWeb3['talisman'];
    };

    const initKeyring = async () => {
      if (isWalletConnected) {
        await web3Enable(APP_NAME);
        uiKeyring.loadAll(
          {
            ss58Format: config.SS58_FORMAT,
            isDevelopment: config.DEVELOPMENT_KEYRING
          },
          [],
        );
        unsubscribe = await web3AccountsSubscribe((allAccounts) => {
          console.log('accounts: ', allAccounts);
          allAccounts.map(({ address, meta, type }) => {
            uiKeyring.loadInjected(address, {...meta, name: meta.name}, type);
            console.log('uiKeyring: ', uiKeyring.getAccounts());
          });
          setKeyring(uiKeyring);
          setKeyringLength(uiKeyring.getAccounts());
        });
      }
    };

    const initKeyringWhenInjected = async () => {
      if (IsWalletInjected()) {
        await initKeyring();
      } else {
        setTimeout(async () => {
          if (!IsWalletInjected()) {
            setKeyring(false);
          } else if (!keyring) {
            await initKeyring();
          }
        }, 500);
      }
    };
    if (!keyring) {
      initKeyringWhenInjected();
    }
    return () => {unsubscribe && unsubscribe();};
  }, [keyring, isWalletConnected]);



  const value = {
    keyring: keyring,
    keyringLength: keyringLength, //keyring object address would not update so use keyring length to trigger re-render
    setIsWalletConnected: setIsWalletConnected
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
