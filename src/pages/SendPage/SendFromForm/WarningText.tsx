import React from 'react';
import { useSend } from '../SendContext';

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

export default WarningText;
