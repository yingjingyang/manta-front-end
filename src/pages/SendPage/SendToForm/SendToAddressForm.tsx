// @ts-nocheck
import React from 'react';
import { useSend } from '../SendContext';
import ToAccountSelect from './ToAccountSelect';
import SendToAddressInput from './SendToAddressInput';
import ReceiverBalanceDisplay from './ReceiverBalanceDisplay';

const SendToAddressForm = () => {
  const { isPrivateTransfer, isPublicTransfer } = useSend();

  return isPrivateTransfer() || isPublicTransfer() ? (
    <div>
      <SendToAddressInput />
      {isPublicTransfer() && <ReceiverBalanceDisplay />}
    </div>
  ) : (
    <>
      <ToAccountSelect />
      <ReceiverBalanceDisplay />
    </>
  );
};

export default SendToAddressForm;
