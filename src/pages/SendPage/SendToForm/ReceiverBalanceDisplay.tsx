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
  const shouldShowInitialSync =
    isInitialSync.current && (isToPrivate() || isPrivateTransfer());
  const balanceString = shouldShowInitialSync
    ? 'Syncing to ledger'
    : receiverCurrentBalance?.toString();
  const shouldShowLoader =
    receiverAddress && !receiverCurrentBalance && !shouldShowInitialSync;

  return (
    <div className="relative gap-4 justify-between items-center px-4 py-2 manta-bg-gray rounded-lg h-20 mb-2">
      <div className="absolute left-4 bottom-7 p-2 cursor-default w-1/2 text-xl text-gray-500 overflow-hidden">
        {senderInputValue || '0.00'}
      </div>
      <div className="absolute right-8 top-2 pl-2 border-0 flex flex-y items-center gap-2 mt-2">
        <div>
          <img
            className="w-5 h-5 rounded-full"
            src={receiverAssetType?.icon}
            alt="icon"
          />
        </div>
        <div className="text-black dark:text-white w-14 place-self-center">
          {receiverAssetType?.ticker}
        </div>
      </div>
      <BalanceDisplay
        balance={balanceString}
        className="absolute text-white right-0 bottom-0 mt-2.5 w-28 h-8 flex flex-row gap-1 text-sm"
        loader={shouldShowLoader}
      />
    </div>
  );
};

export default ReceiverBalanceDisplay;
