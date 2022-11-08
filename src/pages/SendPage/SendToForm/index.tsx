// @ts-nocheck
import React from 'react';
import PublicPrivateToggle from 'pages/SendPage/PublicPrivateToggle';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import SendButton from '../SendButton';
import { useSend } from '../SendContext';
import SendToAddressForm from './SendToAddressForm';

const SendToForm = () => {
  const { toggleReceiverIsPrivate, receiverAssetType } = useSend();
  const { walletIsBusy, isInitialSync } = usePrivateWallet();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 items-stretch">
        <div className="flex flex-row justify-between items-center mb-2">
        <div className="text-black dark:text-white">To</div>
        <PublicPrivateToggle
          onToggle={toggleReceiverIsPrivate}
          isPrivate={receiverAssetType?.isPrivate}
          prefix="receiver"
        />
        </div>
        <SendToAddressForm />
      </div>
      <SendButton />
      <data
        value={isInitialSync.current || walletIsBusy.current}
        data-testing-id="sync-status"
      />
    </div>
  );
};

export default SendToForm;
