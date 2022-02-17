import React from 'react';
import SendAmountInput from './SendAmountInput';
import SendAssetTypeDropdown from './SendAssetTypeDropdown';

const SendAssetSelect = () => {

  return (
    <span className="flex w-100">
      <SendAssetTypeDropdown />
      <SendAmountInput />
    </span>
  );
};

export default SendAssetSelect;
