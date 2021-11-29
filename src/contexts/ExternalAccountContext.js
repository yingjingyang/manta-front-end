import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useSubstrate } from './substrateContext';

const ExternalAccountContext = createContext();

export const ExternalAccountContextProvider = (props) => {
  const { api, keyring, keyringState } = useSubstrate();
  const [externalAccount, setExternalAccount] = useState(null);
  const [externalAccountSigner, setExternalAccountSigner] = useState(null);

  useEffect(() => {
    if (keyringState === 'READY') {
      const allAccounts = keyring.getPairs();
      const initialAccount = allAccounts.length > 0 ? allAccounts[0] : null;
      changeExternalAccount(initialAccount);
    }
  }, [keyringState]);

  const changeExternalAccount = async (account) => {
    const {
      meta: { source, isInjected },
    } = account;
    // signer is from Polkadot-js browser extension
    if (isInjected) {
      const injected = await web3FromSource(source);
      await api.isReady;
      api.setSigner(injected.signer);
    }
    setExternalAccount(account);
    const signer = account.meta.isInjected ? account.address : account;
    setExternalAccountSigner(signer);
  };

  const value = {
    externalAccount: externalAccount,
    externalAccountSigner: externalAccountSigner,
    changeExternalAccount: changeExternalAccount,
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
