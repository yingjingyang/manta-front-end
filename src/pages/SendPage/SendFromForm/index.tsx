// @ts-nocheck
import React from 'react';
import PublicPrivateToggle from 'pages/SendPage/PublicPrivateToggle';
import PublicFromAccountSelect from 'components/Accounts/PublicFromAccountSelect';
import { useSend } from '../SendContext';
import SendAssetSelect from './SendAssetSelect';
import PrivateFromAccountSelect from './PrivateFromAccountSelect';

const WarningText = () => {
  const {
    userHasSufficientFunds,
    txWouldDepleteSuggestedMinFeeBalance,
    senderAssetType
  } = useSend();

  if (userHasSufficientFunds() === false) {
    return <p className="text-xss text-red-500 ml-2">Insufficient balance</p>;
  } else if (txWouldDepleteSuggestedMinFeeBalance()) {
    const feeWarningText = `You need ${senderAssetType.ticker} to pay fees; consider retaining a small balance.`;
    return (
      <p className="text-xss tracking-tight text-yellow-500 ml-2">
        {feeWarningText}
      </p>
    );
  } else {
    return (
      <p className="text-xss text-red-500 ml-2 invisible">Sufficient balance</p>
    );
  }
};

const SendFromForm = () => {
  const { 
    toggleSenderIsPrivate, 
    senderAssetType,
    senderPublicAccount,
    senderPublicAccountOptions,
    setSenderPublicAccount
  } = useSend();

  return (
    <div className="flex-y space-y-1">
      <div className="flex flex-col gap-4 items-stretch mb-4">
        <PublicPrivateToggle
          onToggle={toggleSenderIsPrivate}
          isPrivate={senderAssetType.isPrivate}
          prefix="sender"
        />
        <div className="w-100 items-center flex-grow">
          {senderAssetType.isPrivate ? (
            <PrivateFromAccountSelect />
          ) : (
            <PublicFromAccountSelect 
              senderPublicAccount={senderPublicAccount}
              senderPublicAccountOptions={senderPublicAccountOptions}
              setSenderPublicAccount={setSenderPublicAccount}
            />
          )}
        </div>
      </div>
      <SendAssetSelect />
      <WarningText />
    </div>
  );
};

export default SendFromForm;
