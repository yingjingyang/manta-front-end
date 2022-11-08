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
    isPrivateTransfer,
    senderInputValue,
  } = useSend();
  const { isInitialSync } = usePrivateWallet();
  const balanceString = isInitialSync.current && (isToPrivate() || isPrivateTransfer())
      ? 'Syncing to ledger'
      : receiverCurrentBalance?.toString()

  return (
    <div className="relative gap-4 justify-between items-center px-4 py-2 manta-bg-gray rounded-lg h-24">
      <div className="absolute left-6 top-7 font-bold text-2xl text-gray-500">{senderInputValue || '0.00'}</div>
      <div className="absolute right-11 top-2 pl-2 border-0 flex flex-y items-center gap-3 mt-2 w-1/4">
        <div>
          <img
            className="w-8 h-8 rounded-full"
            src={receiverAssetType?.icon}
            alt="icon"
          />
        </div>
        <div className="text-2xl font-bold text-black dark:text-white">
          {receiverAssetType?.ticker}
        </div>
      </div>
      <BalanceComponent
        balance={balanceString}
        className="absolute manta-gray right-9 bottom-3 flex flex-row gap-1 text-sm"
        loaderClassName="bg-black dark:bg-white"
        loader={receiverAddress && !receiverCurrentBalance}
      />
    </div>
  );
};

export default ReceiverBalanceDisplay;
