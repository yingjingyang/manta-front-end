import React from 'react';
import GradientText from 'components/GradientText';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import BalanceComponent from 'components/Balance';
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
    <div className="flex justify-between items-center px-6 py-2">
      <BalanceComponent
        balance={balanceString}
        className="text-black dark:text-white"
        loaderClassName="bg-black dark:bg-white"
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
