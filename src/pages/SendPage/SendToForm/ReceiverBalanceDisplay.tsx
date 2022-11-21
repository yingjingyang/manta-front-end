import React from 'react';
import GradientText from 'components/GradientText';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import BalanceDisplay from 'components/Balance/BalanceDisplay';
import { useSend } from '../SendContext';

const ReceiverBalanceDisplay = () => {
  const {
    receiverAssetType,
    receiverCurrentBalance,
    receiverAddress,
    isToPrivate,
    isPrivateTransfer
  } = useSend();
  const { isInitialSync } = usePrivateWallet();

  const balanceString =
    isInitialSync && (isToPrivate() || isPrivateTransfer())
      ? 'Syncing to ledger'
      : receiverCurrentBalance?.toString();

  return (
    <div className="flex flex-row gap-4 justify-between items-center px-4 py-2">
      <BalanceDisplay
        balance={balanceString}
        className="flex flex-row gap-1 text-black dark:text-white text-base"
        loader={receiverAddress && !receiverCurrentBalance}
      />
      <div className="pl-2 border-0 flex items-center gap-3">
        <div>
          <img
            className="w-8 h-8 rounded-full"
            src={receiverAssetType?.icon}
            alt="icon"
          />
        </div>
        <GradientText
          className="text-2xl font-bold"
          text={receiverAssetType?.ticker}
        />
      </div>
    </div>
  );
};

export default ReceiverBalanceDisplay;
