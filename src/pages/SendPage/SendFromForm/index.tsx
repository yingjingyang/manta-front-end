// @ts-nocheck
import React from 'react';
import PublicFromAccountSelect from 'pages/SendPage/SendFromForm/PublicFromAccountSelect';
import PublicPrivateToggle from 'pages/SendPage/PublicPrivateToggle';
import { useSend } from '../SendContext';
import SendAssetSelect from './SendAssetSelect';
import PrivateFromAccountSelect from './PrivateFromAccountSelect';

const SendFromForm = () => {
  const { toggleSenderIsPrivate, senderAssetType, userHasSufficientFunds } =
    useSend();

  return (
    <div className="flex-y space-y-2">
      <div className="flex flex-col gap-4 items-stretch mb-4">
        <PublicPrivateToggle
          onToggle={toggleSenderIsPrivate}
          isPrivate={senderAssetType.isPrivate}
        />
        <div className="w-100 items-center flex-grow">
          {senderAssetType.isPrivate ? (
            <PrivateFromAccountSelect />
          ) : (
            <PublicFromAccountSelect />
          )}
        </div>
      </div>
      <SendAssetSelect />
      {userHasSufficientFunds() === false ? (
        <p className="text-xss text-red-500 ml-2">Insufficient balance</p>
      ) : (
        <p className="text-xss text-red-500 ml-2 invisible">
          Sufficient balance
        </p>
      )}
    </div>
  );
};

export default SendFromForm;
