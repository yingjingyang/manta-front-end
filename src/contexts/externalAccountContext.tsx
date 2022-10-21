// @ts-nocheck
import APP_NAME from 'constants/AppConstants';
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef
} from 'react';
import PropTypes from 'prop-types';
import { web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import {
  getLastAccessedExternalAccount,
  setLastAccessedExternalAccountAddress
} from 'utils/persistence/externalAccountStorage';
import { useSubstrate } from './substrateContext';
import { useKeyring } from './keyringContext';
import { useConfig } from './configContext';

const ExternalAccountContext = createContext();

export const ExternalAccountContextProvider = (props) => {
  const config = useConfig();
  const { api } = useSubstrate();
  const { keyring, isKeyringInit, keyringAddresses } = useKeyring();
  const externalAccountRef = useRef(null);
  const [externalAccount, setExternalAccount] = useState(null);
  const [externalAccountSigner, setExternalAccountSigner] = useState(null);
  const [externalAccountOptions, setExternalAccountOptions] = useState([]);
  const [isInitialAccountSet, setIsInitialAccountSet] = useState(false);

  // ensure externalAccount is the first item of externalAccountOptions
  const orderExternalAccountOptions = (
    selectedAccount,
    externalAccountOptions
  ) => {
    let orderedExternalAccountOptions = [];
    orderedExternalAccountOptions.push(selectedAccount);
    externalAccountOptions.forEach((account) => {
      if (account.address !== selectedAccount.address) {
        orderedExternalAccountOptions.push(account);
      }
    });

    return orderedExternalAccountOptions;
  };

  const setSignerOnChangeExternalAccount = async (account) => {
    if (!account) return;
    const {
      meta: { source, isInjected }
    } = account;
    // signer is from Polkadot-js browser extension

    const extensions = await web3Enable(APP_NAME);
    const extensionNames = extensions.map(ext => ext.name);
    if (isInjected && extensionNames.includes(source)) {
      const injected = await web3FromSource(source);
      api.setSigner(injected.signer);
    }
    const signer = account.meta.isInjected
      ? account.address
      : account;
    setExternalAccountSigner(signer);
  };

  const setStateWhenRemoveActiveExternalAccount = () => {
    if (keyringAddresses.length > 0) {
      // reset state if account(s) exist after disable selected external account
      const externalAccountOptions = keyring.getPairs();
      changeExternalAccount(externalAccountOptions[0], externalAccountOptions);
    } else {
      // reset state if no account exist after disable selected external account
      changeExternalAccount(null, []);
      setExternalAccountSigner(null);
      setExternalAccountOptions([]);
    }
  };

  useEffect(() => {
    const setInitialExternalAccount = async () => {
      if (
        !isInitialAccountSet &&
        api &&
        isKeyringInit &&
        keyringAddresses.length > 0
      ) {
        // The user's default account is either their last accessed polkadot.js account,
        // or, as a fallback, the first account in their polkadot.js wallet
        const externalAccountOptions = keyring.getPairs();
        let initialAccount =
          getLastAccessedExternalAccount(config, keyring) ||
          externalAccountOptions[0];
        changeExternalAccount(initialAccount, externalAccountOptions);
        setIsInitialAccountSet(true);
      }
    };
    setInitialExternalAccount();
  }, [api, isInitialAccountSet, isKeyringInit, keyringAddresses]);

  useEffect(() => {
    const handleKeyringAddressesChange = () => {
      if (!isInitialAccountSet || !api) return;
      // ensure newly added account after removing all accounts can be updated
      if (!externalAccount) {
        const accounts = keyring.getPairs();
        changeExternalAccount(accounts[0], accounts);
        return;
      }

      if (!keyringAddresses.includes(externalAccount.address)) {
        setStateWhenRemoveActiveExternalAccount();
      } else {
        setExternalAccountOptions(
          orderExternalAccountOptions(externalAccount, keyring.getPairs())
        );
      }
    };
    handleKeyringAddressesChange();
  }, [isInitialAccountSet, keyringAddresses]);

  const changeExternalAccount = async (account, externalAccounts) => {
    setExternalAccount(account);
    setExternalAccountOptions(
      orderExternalAccountOptions(account, externalAccounts)
    );
    setSignerOnChangeExternalAccount(account);
    externalAccountRef.current = account;
    setLastAccessedExternalAccountAddress(config, account?.address);
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
  children: PropTypes.any
};

export const useExternalAccount = () => ({
  ...useContext(ExternalAccountContext)
});
