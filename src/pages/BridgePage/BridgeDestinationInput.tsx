// @ts-nocheck
import React, { useState } from 'react'
import classNames from 'classnames';
import { useTxStatus } from 'contexts/txStatusContext';
import { useBridgeData } from './BridgeContext/BridgeDataContext';
import { ethers } from 'ethers';
import { useMetamask } from 'contexts/metamaskContext';
import { useExternalAccount } from 'contexts/externalAccountContext';
import { validatePublicAddress } from 'utils/validation/validateAddress';
import Svgs from 'resources/icons';
import { useKeyring } from 'contexts/keyringContext';

const BridgeDestinationInput = () => {
  const { ethAddress } = useMetamask();
  const { setDestinationAddress, destinationAddress, destinationChain } = useBridgeData();
  const { selectedWallet } = useKeyring();
  const { externalAccount } = useExternalAccount();
  const { txStatus } = useTxStatus();
  const disabled = txStatus?.isProcessing();
  const [inputValue, setInputValue] = useState('')

  const destinationIsEvmChain = destinationChain.xcmAdapter.chain.type === 'ethereum';

  const validateAddress = (maybeAddress) => {
    if (destinationIsEvmChain) {
      return ethers.utils.isAddress(maybeAddress)
    }
    return validatePublicAddress(maybeAddress);
  }

  const onChangeDestinationtInput = (value) => {
    if (value === '') {
      setInputValue(null);
      setDestinationAddress('');
    } else if (validateAddress(value)) {
      setInputValue(value);
      setDestinationAddress(value)
    } else {
      setInputValue(value);
      setDestinationAddress(null);
    }
  };

  const onClickGetAddress = () => {
    if (destinationIsEvmChain) {
      onChangeDestinationtInput(ethAddress);
    } else {
      onChangeDestinationtInput(externalAccount?.address);
    }
  }

  const getAddressIcon = () => {
    if (destinationIsEvmChain) {
      return Svgs.Metamask
    } else {
      return <img className="w-6 h-6 w-100" src={selectedWallet.logo.src} alt={selectedWallet.logo.alt} />
    }
  }

  const getAccountName = () => {
    if (destinationIsEvmChain) {
      return 'Metamask'
    } else {
      return externalAccount?.meta.name
    }
  }

  const ButtonContents = () => {
    return (
      <span className='max-w-28 flex justify-center whitespace-nowrap overflow-hidden'>
        {
          destinationAddress ? (
          <>
          <i className='w-100 inline-block'>{getAddressIcon()}</i>
          <p className='max-w-16 inline-block pt-0.5 ml-1 overflow-hidden'>{getAccountName()}</p>
          </>
          )
          : 'Get Address'
        }
      </span>
    )
  }

  return (
    <div
    className='flex items-center flex-grow h-16 mx-1'
  >
    <input
      id="recipientAddress"
      className="w-96 h-full rounded-lg manta-bg-gray px-5 text-black dark:text-white outline-none rounded-lg"
      onChange={(e) => onChangeDestinationtInput(e.target.value)}
      value={inputValue}
      disabled={disabled}
      placeholder={'address'}
    />
    <button
      onClick={onClickGetAddress}
      className={classNames('w-32 ml-1 h-full rounded-lg px-1 text-black',
        'dark:text-white outline-none rounded-2xl border-2 border-solid border-blue-500',
        'text-xs  text-black dark:text-white'
     )}
    >
      <ButtonContents />
    </button>
  </div>
  );
};

export default BridgeDestinationInput
