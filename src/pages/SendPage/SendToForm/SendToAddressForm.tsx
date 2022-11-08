// @ts-nocheck
import React from 'react';
import { useSend } from '../SendContext';
import SendToAddressInput from './SendToAddressInput';
import ReceiverBalanceDisplay from './ReceiverBalanceDisplay';
import ToAccountSelect from './ToAccountSelect';

const SendToAddressForm = () => {
  const { isPrivateTransfer, isPublicTransfer } = useSend();

  return isPrivateTransfer() || isPublicTransfer() ? (
    <>
      <SendToAddressInput />
    </>
  ) : (
    <>
      <ReceiverBalanceDisplay />
    </>
  );
};

export default SendToAddressForm;
