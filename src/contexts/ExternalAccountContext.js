import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSubstrate } from './SubstrateContext';

const ExternalAccountContext = createContext();

export const ExternalAccountContextProvider = props => {
  const { keyring, keyringState } = useSubstrate();
  const [currentExternalAccount, setCurrentExternalAccount] = useState(null);

  useEffect(() => {
    if (keyringState === 'READY') {
      const allAccounts = keyring.getPairs();
      const initialAccount = allAccounts.length > 0 ? allAccounts[0] : null;
      setCurrentExternalAccount(initialAccount);
    }
  }, [keyringState]);

  const value = {
    'currentExternalAccount': currentExternalAccount,
    'setCurrentExternalAccount': setCurrentExternalAccount,
  };
  return <ExternalAccountContext.Provider value={value} > {props.children} </ ExternalAccountContext.Provider >;
};

ExternalAccountContextProvider.propTypes = {
  children: PropTypes.any
};


export const useExternalAccount = () => ({ ...useContext(ExternalAccountContext) });
