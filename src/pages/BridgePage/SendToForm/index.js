import PublicPrivateToggle from 'pages/SendPage/PublicPrivateToggle';
import React from 'react';
import SendButton from '../SendButton';
import { useSend } from '../SendContext';
import SendToPrivateAddressSelect from './SendToPrivateAddressSelect';
import SendToPublicAddressSelect from './SendToPublicAddressSelect';

const SendToForm = () => {
  const {
    toggleReceiverAccountIsPrivate,
    receiverIsPrivate
  } = useSend();

  return (
    <div className="flex-y space-y-2">
      <PublicPrivateToggle
        label="To: "
        onToggle={toggleReceiverAccountIsPrivate}
        isPrivate={receiverIsPrivate}
      />
      {
        receiverIsPrivate ?
          <SendToPrivateAddressSelect /> :
          <SendToPublicAddressSelect />
      }
      <SendButton />
    </div>
  );
};

export default SendToForm;
