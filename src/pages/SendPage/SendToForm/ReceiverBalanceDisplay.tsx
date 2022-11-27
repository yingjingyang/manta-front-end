import React from 'react';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import BalanceDisplay from 'components/Balance/BalanceDisplay';
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
    <div className="relative gap-4 justify-between items-center px-4 py-2 manta-bg-gray rounded-lg h-20">
      <div className="absolute left-6 top-7 cursor-default w-1/2 text-2xl text-gray-500 overflow-hidden font-bold">
        {senderInputValue || '0.00'}
      </div>
      <div className="absolute right-11 top-2 pl-2 border-0 flex flex-y items-center gap-2 mt-2">
        <div>
          <img
            className="w-5 h-5 rounded-full"
            src={receiverAssetType?.icon}
            alt="icon"
          />
        </div>
        <div className="text-black dark:text-white">
          {receiverAssetType?.ticker}
        </div>
      </div>
      <BalanceDisplay
        balance={balanceString}
        className="absolute manta-gray right-9 bottom-3 flex flex-row gap-1 text-sm"
        loader={receiverAddress && !receiverCurrentBalance}
      />
    </div>
  );
};

export default ReceiverBalanceDisplay;
