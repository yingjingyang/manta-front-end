// @ts-nocheck
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useTxStatus } from 'contexts/txStatusContext';
import detectEthereumProvider from '@metamask/detect-provider';
import ethers from 'ethers';


const ConnectMetamaskButton = () => {
  const { txStatus } = useTxStatus();
  const [metamask, setMetamask] = useState(null);
  const [metamaskIsConnected, setMetamaskIsConnected] = useState(false);

  const disabled = txStatus?.isProcessing();

  useEffect(() => {
    const detectMetamask = async () => {
      if (!metamask) {
        const metamask = await detectEthereumProvider({ mustBeMetaMask: true });
        if (metamask) {
          setMetamask(metamask);
        } else {
          setMetamask(false);
        }
      }
    };
    detectMetamask();
  });

  const tryXcm = async () => {
    // 2. Define network configurations
    const providerRPC = {
      dev: {
        name: 'moonbeam-development',
        rpc: 'http://127.0.0.1:9972',
        chainId: 1281, // 0x501 in hex,
      },
    };
    // 3. Create ethers provider
    const provider = new ethers.providers.StaticJsonRpcProvider(
      providerRPC.dev.rpc,
      {
        chainId: providerRPC.dev.chainId,
        name: providerRPC.dev.name,
      }
    );
  };

  const configureMoonRiver = async () => {
    try {
      await metamask.request({ method: 'eth_requestAccounts'});
      await metamask.request({
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
      setMetamaskIsConnected(true);
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
        metamask === false && <div>Please install metamask</div>
      }
      {
        (metamask && !metamaskIsConnected) &&
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
        metamaskIsConnected && metamask.selectedAddress
      }
    </div>
  );
};

export default ConnectMetamaskButton;
