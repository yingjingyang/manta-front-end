// @ts-nocheck
import React from 'react';
import { useTxStatus } from 'contexts/txStatusContext';
import {
  validatePrivateAddress,
  validatePublicAddress
} from 'utils/validation/validateAddress';
import { useSend } from '../SendContext';

const SendToAddressInput = () => {
  const { setReceiver, receiverAssetType, receiverAddress } = useSend();
  const { txStatus } = useTxStatus();
  const disabled = txStatus?.isProcessing();

  const onChangePrivateInput = (event) => {
    if (event.target.value === '') {
      setReceiver(null);
      return;
    }
    const addressIsValid = validatePrivateAddress(event.target.value);
    if (addressIsValid) {
      setReceiver(event.target.value);
    } else {
      setReceiver(false);
    }
  };

  const onChangePublicInput = (event) => {
    if (event.target.value === '') {
      setReceiver(null);
      return;
    }
    const addressIsValid = validatePublicAddress(event.target.value);
    if (addressIsValid) {
      setReceiver(event.target.value);
    } else {
      setReceiver(false);
    }
  };

  const onChangeInput = receiverAssetType?.isPrivate ? onChangePrivateInput : onChangePublicInput;

  return (
    <>
      <div
        className={`flex-grow manta-bg-gray ${
          receiverAddress === false && 'error'
        } h-12 rounded-lg px-0.5 py-2`}
      >
        <input
          id="recipientAddress"
          className="w-full h-full rounded-lg manta-bg-gray px-5 text-black dark:text-white outline-none"
          onChange={(e) => onChangeInput(e)}
          disabled={disabled}
          placeholder={'address'}
        />
      </div>
    </>
  );
};

export default SendToAddressInput;
