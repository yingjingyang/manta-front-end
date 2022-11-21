// @ts-nocheck
import React from 'react';
import { useState } from 'react';
import { useTxStatus } from 'contexts/txStatusContext';
import {
  validatePrivateAddress,
  validatePublicAddress
} from 'utils/validation/validateAddress';
import { useSend } from '../SendContext';

const SendToAddressInput = () => {
  const { setReceiver, receiverAssetType } = useSend();
  const { txStatus } = useTxStatus();
  const disabled = txStatus?.isProcessing();
  const [errorMessage, setErrorMessage] = useState(null);

  const onChangePrivateInput = (event) => {
    if (event.target.value === '') {
      setErrorMessage(null);
      setReceiver(null);
      return;
    }
    const addressIsValid = validatePrivateAddress(event.target.value);
    if (addressIsValid) {
      setErrorMessage(null);
      setReceiver(event.target.value);
    } else {
      setReceiver(null);
      const addressIsPublic = validatePublicAddress(event.target.value);
      if (addressIsPublic) {
        setErrorMessage('Provided address is public, not private');
      } else {
        setErrorMessage('Invalid address');
      }
    }
  };

  const onChangePublicInput = (event) => {
    if (event.target.value === '') {
      setErrorMessage(null);
      setReceiver(null);
      return;
    }
    const addressIsValid = validatePublicAddress(event.target.value);
    if (addressIsValid) {
      setErrorMessage(null);
      setReceiver(event.target.value);
    } else {
      setReceiver(null);
      const addressIsPrivate = validatePrivateAddress(event.target.value);
      if (addressIsPrivate) {
        setErrorMessage('Provided address is private, not public');
      } else {
        setErrorMessage('Invalid address');
      }
    }
  };

  const onChangeInput = receiverAssetType?.isPrivate ? onChangePrivateInput : onChangePublicInput;

  return (
    <>
      <div
        className={`flex-grow manta-bg-gray ${
          errorMessage && 'error'
        } h-16 rounded-lg p-0.5 py-3`}
      >
        <input
          id="recipientAddress"
          className="w-full h-full rounded-lg manta-bg-gray px-5 text-black dark:text-white outline-none"
          onChange={(e) => onChangeInput(e)}
          disabled={disabled}
          placeholder={'address'}
        />
      </div>
      <div className='h-4 pt-1'>
        <p className='text-xss text-red-500 ml-2'>{errorMessage}</p>
      </div>
    </>
  );
};

export default SendToAddressInput;
