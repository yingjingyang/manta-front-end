// @ts-nocheck
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useSubstrate } from './substrateContext';
import { useKeyring } from './keyringContext';

const ExternalAccountContext = createContext();

export const ExternalAccountContextProvider = (props) => {
  const { api } = useSubstrate();
  const { keyring } = useKeyring();
  const externalAccountRef = useRef(null);
  const [externalAccount, setExternalAccount] = useState(null);
  const [externalAccountSigner, setExternalAccountSigner] = useState(null);
  const [externalAccountOptions, setExternalAccountOptions] = useState([]);

  useEffect(() => {
    const setInitialExternalAccount = async () => {
      if (keyring && api && keyring.getPairs().length > 0) {
        await api.isReady;
        // The user's default account is either their last accessed polkadot.js account,
        // or, as a fallback, the first account in their polkadot.js wallet
        const externalAccountOptions =  keyring.getPairs();
        const initialAccount = (
          // getLastAccessedExternalAccount(keyring) ||
          externalAccountOptions[0]
        );
        setExternalAccountOptions(externalAccountOptions);
        changeExternalAccount(initialAccount);
      }
    };
    setInitialExternalAccount();
  }, [keyring, api]);

  useEffect(() => {
    if (!externalAccount || !api) return;
    const setSignerOnChangeExternalAccount = async () => {
      await api.isReady;
      const {
        meta: { source, isInjected },
      } = externalAccount;
      // signer is from Polkadot-js browser extension
      if (isInjected) {
        const injected = await web3FromSource(source);
        await api.isReady;
        api.setSigner(injected.signer);
      }
      const signer = externalAccount.meta.isInjected ? externalAccount.address : externalAccount;
      setExternalAccountSigner(signer);
    };
    setSignerOnChangeExternalAccount();
  });

  const changeExternalAccount = async (account) => {
    setExternalAccount(account);
    externalAccountRef.current = account;
  };

  const value = {
    externalAccount,
    externalAccountRef,
    externalAccountSigner,
    externalAccountOptions: externalAccountOptions,
    changeExternalAccount
  };

  return (
    <ExternalAccountContext.Provider value={value}>
      {props.children}
    </ExternalAccountContext.Provider>
  );
};

ExternalAccountContextProvider.propTypes = {
  children: PropTypes.any,
};

export const useExternalAccount = () => ({
  ...useContext(ExternalAccountContext),
});
