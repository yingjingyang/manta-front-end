import PublicFromAccountSelect from 'pages/SendPage/SendFromForm/PublicFromAccountSelect';
import PublicPrivateToggle from 'pages/SendPage/PublicPrivateToggle';
import React from 'react';
import { useSend } from '../SendContext';
import SendAssetSelect from './SendAssetSelect';
import PrivateFromAccountSelect from './PrivateFromAccountSelect';

const SendFromForm = () => {
  const {
    toggleSenderAccountIsPrivate,
    senderAccountIsPrivate
  } = useSend();

  return (
    <div className="flex-y space-y-2">
      <PublicPrivateToggle
        label="From: "
        onToggle={toggleSenderAccountIsPrivate}
        isPrivate={senderAccountIsPrivate}
      />
      <div className="h-16 w-100 items-center">
        {
          senderAccountIsPrivate ?
            <PrivateFromAccountSelect /> :
            <PublicFromAccountSelect />
        }
      </div>
      <SendAssetSelect />
    </div>
  );
};

export default SendFromForm;
