// @ts-nocheck
import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import detectEthereumProvider from '@metamask/detect-provider';
import Chain from 'types/Chain';
import { useConfig } from './configContext';
import { getHasAuthToConnectMetamaskStorage } from 'utils/persistence/connectAuthorizationStorage';

const MetamaskContext = createContext();

export const MetamaskContextProvider = (props) => {
  const config = useConfig();
  const [provider, setProvider] = useState(null);
  const [ethAddress, setEthAddress] = useState(null);
  const [hasAuthConnectMetamask, setHasAuthConnectMetamask] = useState(getHasAuthToConnectMetamaskStorage());

  const configureMoonRiver = async () => {
    try {
      await provider.request({ method: 'eth_requestAccounts' });
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [Chain.Moonriver(config).ethMetadata]
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const detectMetamask = async () => {
        if (!provider) {
          const metamask = await detectEthereumProvider({
            mustBeMetaMask: true
          });
          if (metamask) {
            setProvider(metamask);
            // check metamask locked 
            if (metamask?.selectedAddress && hasAuthConnectMetamask) {
              setEthAddress(metamask.selectedAddress);
            }
          }
        } else {
          // check metamask locked 
          if (provider?.selectedAddress && hasAuthConnectMetamask) {
            setEthAddress(provider.selectedAddress);
          }
        }
    };

    const interval = setInterval(async () => {
      detectMetamask();
    }, 2000);
    return () => clearInterval(interval);
  });

  const value = {
    provider,
    setProvider,
    ethAddress,
    configureMoonRiver,
    setHasAuthConnectMetamask
  };

  return (
    <MetamaskContext.Provider value={value}>
      {props.children}
    </MetamaskContext.Provider>
  );
};

MetamaskContextProvider.propTypes = {
  children: PropTypes.any
};

export const useMetamask = () => ({
  ...useContext(MetamaskContext)
});
