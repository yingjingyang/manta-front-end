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
import { getWallets } from '@talismn/connect-wallets';
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


  const setApiSigner = (api) => {
    api?.setSigner(null);
    if (!externalAccount || !api) {
      return;
    }
    const {
      meta: { source, isInjected }
    } = externalAccount;
    const extensions = getWallets().filter((wallet) => wallet.extension);
    const extensionNames = extensions.map((ext) => ext.extensionName);
    if (isInjected && extensionNames.includes(source)) {
      const selectedWallet = getWallets().find(
        (wallet) => wallet.extensionName === source
      );
      api.setSigner(selectedWallet._signer);
    }
    const signer = externalAccount.meta.isInjected
      ? externalAccount.address
      : externalAccount;
    setExternalAccountSigner(signer);
  }

  useEffect(() => {
    const setSignerOnChangeExternalAccount = async () => {
      setApiSigner(api)
    };
    setSignerOnChangeExternalAccount();
  }, [api, externalAccount]);

  const setStateWhenRemoveActiveExternalAccount = () => {
    if (keyringAddresses.length > 0) {
      // reset state if account(s) exist after disable selected external account
      const externalAccountOptions = keyring.getPairs();
      changeExternalAccountOptions(
        externalAccountOptions[0],
        externalAccountOptions
      );
    } else {
      // reset state if no account exist after disable selected external account
      changeExternalAccountOptions(null, []);
      setExternalAccountSigner(null);
      setExternalAccountOptions([]);
    }
  };

  useEffect(() => {
    const setInitialExternalAccount = async () => {
      if (
        !isInitialAccountSet &&
        isKeyringInit &&
        keyringAddresses.length > 0
      ) {
        const keyringExternalAccountOptions = keyring.getPairs();
        if (keyringExternalAccountOptions.length === 0) {
          return;
        }
        // The user's default account is either their last accessed polkadot.js account,
        // or, as a fallback, the first account in their polkadot.js wallet
        let initialAccount =
          getLastAccessedExternalAccount(config, keyring) ||
          keyringExternalAccountOptions[0];
        changeExternalAccountOptions(
          initialAccount,
          keyringExternalAccountOptions
        );
        setIsInitialAccountSet(true);
      }
    };
    setInitialExternalAccount();
  }, [isInitialAccountSet, isKeyringInit, keyringAddresses]);

  useEffect(() => {
    const handleKeyringAddressesChange = () => {
      if (!isInitialAccountSet || !api) {
        return;
      }
      // ensure newly added account after removing all accounts can be updated
      if (!externalAccount) {
        const accounts = keyring.getPairs();
        changeExternalAccountOptions(accounts[0], accounts);
      } else if (!keyringAddresses.includes(externalAccount.address)) {
        setStateWhenRemoveActiveExternalAccount();
      } else {
        setExternalAccountOptions(
          orderExternalAccountOptions(externalAccount, keyring.getPairs() || [])
        );
      }
    };
    handleKeyringAddressesChange();
  }, [isInitialAccountSet, keyringAddresses]);

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

  const changeExternalAccount = async (account) => {
    changeExternalAccountOptions(account, externalAccountOptions);
  };

  const changeExternalAccountOptions = async (account, newExternalAccounts) => {
    setExternalAccount(account);
    setExternalAccountOptions(
      orderExternalAccountOptions(account, newExternalAccounts)
    );
    externalAccountRef.current = account;
    setLastAccessedExternalAccountAddress(config, account?.address);
  };

  const value = {
    setApiSigner,
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
