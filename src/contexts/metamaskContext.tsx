// @ts-nocheck
import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import detectEthereumProvider from '@metamask/detect-provider';


const MetamaskContext = createContext();

export const MetamaskContextProvider = (props) => {
  const [provider, setProvider] = useState(null);
  const ethAddress = provider?.selectedAddress;

  useEffect(() => {
    const detectMetamask = async () => {
      if (!provider) {
        const metamask = await detectEthereumProvider({ mustBeMetaMask: true });
        if (metamask) {
          setProvider(metamask);
        } else {
          setProvider(false);
        }
      }
    };
    detectMetamask();
  });


  const value = {
    provider,
    setProvider,
    ethAddress,
  };

  return (
    <MetamaskContext.Provider value={value}>
      {props.children}
    </MetamaskContext.Provider>
  );
};

MetamaskContextProvider.propTypes = {
  children: PropTypes.any,
};

export const useMetamask = () => ({
  ...useContext(MetamaskContext),
});
