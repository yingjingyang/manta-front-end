// @ts-nocheck
import React from 'react';
import PublicPrivateToggle from 'pages/SendPage/PublicPrivateToggle';
import { useSend } from '../SendContext';
import SendAssetSelect from './SendAssetSelect';
import FormErrorText from 'components/Error/FormErrorText';

const SendFromForm = () => {
  const {
    toggleSenderIsPrivate,
    senderAssetType,
    // userHasSufficientFunds,
    // txWouldDepleteSuggestedMinFeeBalance
  } = useSend();

  // let errorText = null;
  // if (userHasSufficientFunds() === false) {
  //   errorText = 'Insufficient balance';
  // }

  // let warningText = null;
  // if (txWouldDepleteSuggestedMinFeeBalance()) {
  //   warningText = `You need ${senderAssetType.ticker} to pay fees; consider retaining a small balance.`
  // }

  return (
    <div>
      <div className="mb-4 items-stretch">
        <div className="flex flex-row justify-between items-center">
          <div className="text-black dark:text-white">From</div>
          <PublicPrivateToggle
            onToggle={toggleSenderIsPrivate}
            isPrivate={senderAssetType.isPrivate}
            prefix="sender"
          />
        </div>
      </div>
      <SendAssetSelect />
      {/* <FormErrorText errorText={errorText} warningText={warningText} /> */}
    </div>
  );
};

export default SendFromForm;
