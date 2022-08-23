// @ts-nocheck
import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import detectEthereumProvider from '@metamask/detect-provider';


const MetamaskContext = createContext();

export const MetamaskContextProvider = (props) => {
  const [provider, setProvider] = useState(null);
  const ethAddress = provider?.selectedAddress;

  // useEffect(() => {
  //   const configureMoonRiver = async () => {
  //     try {
  //       console.log('provider', provider);
  //       await provider.request({ method: 'eth_requestAccounts'});
  //       await provider.request({
  //         method: 'wallet_addEthereumChain',
  //         params: [
  //           {
  //             chainId: '0x500',
  //             chainName: 'Moonriver Development Testnet',
  //             nativeCurrency: {
  //               name: 'MOVR',
  //               symbol: 'MOVR',
  //               decimals: 18
  //             },
  //             rpcUrls: ['http://127.0.0.1:9972']
  //           }
  //         ]
  //       });
  //       setProviderIsConnected(true);
  //       await tryXcm();
  //     } catch(e) {
  //       console.error(e);
  //     }
  //   };
  //   if (provider) {
  //     configureMoonRiver()
  //   }
  // }, )

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
