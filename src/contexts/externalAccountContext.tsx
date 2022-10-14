// @ts-nocheck
import APP_NAME from 'constants/AppConstants';
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { getLastAccessedExternalAccount, setLastAccessedExternalAccountAddress } from 'utils/persistence/externalAccountStorage';
import { useSubstrate } from './substrateContext';
import { useKeyring } from './keyringContext';
import { useConfig } from './configContext';

const ExternalAccountContext = createContext();

export const ExternalAccountContextProvider = (props) => {
  const config = useConfig();
  const { api } = useSubstrate();
  const { keyring, isKeyringLoaded, keyringAddresses } = useKeyring();
  const externalAccountRef = useRef(null);
  const [externalAccount, setExternalAccount] = useState(null);
  const [externalAccountSigner, setExternalAccountSigner] = useState(null);
  const [externalAccountOptions, setExternalAccountOptions] = useState([]);

  const orderExternalAccountOptions = (selectedAccount, externalAccountOptions) => {
    let orderedExternalAccountOptions = [];
    orderedExternalAccountOptions.push(selectedAccount);
    externalAccountOptions.map((account) => {
      if (account.address !== selectedAccount.address) {
        orderedExternalAccountOptions.push(account);
      }
    });
    return orderedExternalAccountOptions;
  };

  useEffect(() => {
    const setInitialExternalAccount = async () => {
      if (api && isKeyringLoaded() && keyringAddresses.length > 0) {
        // The user's default account is either their last accessed polkadot.js account,
        // or, as a fallback, the first account in their polkadot.js wallet
        const externalAccountOptions =  keyring.getPairs();
        let initialAccount = (
          getLastAccessedExternalAccount(config, keyring) ||
          externalAccountOptions[0]
        );
        changeExternalAccount(initialAccount, externalAccountOptions);
      }
    };
    setInitialExternalAccount();
  }, [api, keyringAddresses]);

  useEffect(() => {
    if (!externalAccount || !api) return;
    const setSignerOnChangeExternalAccount = async () => {
      // check whether external account is disabled
      if (keyringAddresses.includes(externalAccount.address)) {
        const {
          meta: { source, isInjected },
        } = externalAccount;
        // signer is from Polkadot-js browser extension
        if (isInjected) {
          await web3Enable(APP_NAME);
          const injected = await web3FromSource(source);
          api.setSigner(injected.signer);
        }
        const signer = externalAccount.meta.isInjected ? externalAccount.address : externalAccount;
        setExternalAccountSigner(signer);
      } else {
        if (keyringAddresses.length > 0) {
          // reset everything if there are accounts after disable selected external account
          const externalAccountOptions =  keyring.getPairs();
          changeExternalAccount(externalAccountOptions[0], externalAccountOptions);
        } else {
          // reset everything if there are no account after disable selected external account
          changeExternalAccount(null, []);
          setExternalAccountSigner(null);
          setExternalAccountOptions([]);
          setExternalAccountSigner(null);
        }
      }
    };
    setSignerOnChangeExternalAccount();
  });

  const changeExternalAccount = async (account, externalAccounts) => {
    setExternalAccount(account);
    setExternalAccountOptions(orderExternalAccountOptions(account, externalAccounts));
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
  children: PropTypes.any,
};

export const useExternalAccount = () => ({
  ...useContext(ExternalAccountContext),
});
