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

  useEffect(() => {
    if (keyring && api) {
      const allAccounts = keyring.getPairs();
      const initialAccount = allAccounts.length > 0 ? allAccounts[0] : null;
      changeExternalAccount(initialAccount);
    }
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
    externalAccount: externalAccount,
    externalAccountRef: externalAccountRef,
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
