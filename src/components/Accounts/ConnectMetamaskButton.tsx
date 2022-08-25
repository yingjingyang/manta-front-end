// @ts-nocheck
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useTxStatus } from 'contexts/txStatusContext';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import Xtokens from 'eth/Xtokens.json';

const ConnectMetamaskButton = () => {
  const { txStatus } = useTxStatus();
  const [provider, setProvider] = useState(null);
  const [metamaskIsConnected, setProviderIsConnected] = useState(false);

  const disabled = txStatus?.isProcessing();

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

  const tryXcm = async () => {
    const abi = Xtokens.abi;

    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();

    // 0x0824 -> 2084

    const contractAddress = '0x0000000000000000000000000000000000000804';

    const contract = new ethers.Contract(contractAddress, abi, signer);

    const transfer = async () => {
      console.log(`Calling the reset function in contract at address: ${contractAddress}`);

      // transfer(address currency_address, uint256 amount, Multilocation memory destination, uint64 weight)
      const currency_address = '0x0000000000000000000000000000000000000802';
      const amount = '10000000000000000000';
      const destination = [
        1,
        [
          '0x0000000824',  '0x01d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d00'
        ]
      ];
      const weight = '4000000000';

      const createReceipt = await contract.transfer(currency_address, amount, destination, weight);
      console.log('createReceipt', createReceipt);
      // await createReceipt.wait();

      // console.log(`Tx successful with hash: ${createReceipt.hash}`);
    };

    try {
      transfer();
    } catch (error) {
      console.error(error);
    }
  };

  const configureMoonRiver = async () => {
    try {
      await provider.request({ method: 'eth_requestAccounts'});
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x500',
            chainName: 'Moonbase Development Testnet',
            nativeCurrency: {
              name: 'DEV',
              symbol: 'DEV',
              decimals: 18
            },
            rpcUrls: ['http://127.0.0.1:9973']
          }
        ]
      });
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
