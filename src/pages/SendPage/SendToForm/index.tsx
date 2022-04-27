// @ts-nocheck
import React from 'react';
import PublicPrivateToggle from 'pages/SendPage/PublicPrivateToggle';
import SendButton from '../SendButton';
import { useSend } from '../SendContext';
import SendToPrivateAddressForm from './SendToPrivateAddressForm';
import SendToPublicAddressForm from './SendToPublicAddressForm';

const SendToForm = () => {
  const { toggleReceiverIsPrivate, receiverAssetType } = useSend();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 items-stretch">
        <PublicPrivateToggle
          onToggle={toggleReceiverIsPrivate}
          isPrivate={receiverAssetType.isPrivate}
        />
        {receiverAssetType.isPrivate ? (
          <SendToPrivateAddressForm />
        ) : (
          <SendToPublicAddressForm />
        )}
      </div>
      <SendButton />
    </div>
  );
};

export default SendToForm;
