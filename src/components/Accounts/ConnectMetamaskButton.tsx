// @ts-nocheck
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useTxStatus } from 'contexts/txStatusContext';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
// import Xtokens from 'eth/Xtokens.json';

const ConnectMetamaskButton = () => {
  console.log('Xtokens', Xtokens);
  const { txStatus } = useTxStatus();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [metamaskIsConnected, setProviderIsConnected] = useState(false);

  const disabled = txStatus?.isProcessing();

  useEffect(() => {
    const detectMetamask = async () => {
      if (!provider) {
        const metamask = await detectEthereumProvider({ mustBeMetaMask: true });
        if (metamask) {
          const provider = new ethers.providers.Web3Provider(metamask);
          setProvider(provider);
          setSigner(provider.getSigner());
        } else {
          setProvider(false);
        }
      }
    };
    detectMetamask();
  });

  const tryXcm = async () => {
    // 2. Define network configurations


  };

  const configureMoonRiver = async () => {
    try {
      await provider.request({ method: 'eth_requestAccounts'});
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x501',
            chainName: 'Moonbeam development',
            nativeCurrency: {
              name: 'DEV',
              symbol: 'DEV',
              decimals: 12
            },
            rpcUrls: ['http://127.0.0.1:9972']
          },
        ]
      });
      setProviderIsConnected(true);
      await tryXcm();
    } catch(e) {
      console.error(e);
    }
  };

  const onClick = () => {
    if (!disabled) {
      configureMoonRiver();
    }
  };

  return (
    <div>
      {
        provider === false && <div>Please install provider</div>
      }
      {
        (provider && !metamaskIsConnected) &&
        <button
          onClick={onClick}
          className={
            classNames(
              'py-3 cursor-pointer text-xl btn-hover unselectable-text',
              'text-center rounded-lg btn-primary w-full',
              {'disabled': disabled}
            )}
        >
          Connect to Metamask
        </button>
      }
      {
        metamaskIsConnected && provider.selectedAddress
      }
    </div>
  );
};

export default ConnectMetamaskButton;
