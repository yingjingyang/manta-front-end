// @ts-nocheck
import React from 'react';
import PublicPrivateToggle from 'pages/SendPage/PublicPrivateToggle';
import { useSend } from '../SendContext';
import FromAccountSelect from './FromAccountSelect';
import SendAssetSelect from './SendAssetSelect';
import WarningText from './WarningText';

const SendFromForm = () => {
  const {
    toggleSenderIsPrivate,
    senderAssetType,
  } = useSend();

  return (
    <div className="flex-y space-y-1">
      <div className="flex flex-col gap-4 items-stretch mb-4">
        <PublicPrivateToggle
          onToggle={toggleSenderIsPrivate}
          isPrivate={senderAssetType.isPrivate}
          prefix="sender"
        />
        <div className="w-100 items-center flex-grow">
          <FromAccountSelect />
        </div>
      </div>
      <SendAssetSelect />
      <WarningText />
    </div>
  );
};

export default SendFromForm;
