import React from 'react';
import { validatePrivateAddress } from 'utils/validation/validateAddress';
import SendToAddressSelect from './SendToAddressSelect';

const EXTERNAL_ACCOUNT_LABEL = 'External Private Account';

const INTERNAL_ACCOUNT_LABEL = 'My Private Account';


const toReactSelectOption = (address) => {
  if (address) {
    return {
      value: address,
      label: INTERNAL_ACCOUNT_LABEL,
      isInternal: true
    };
  } else {
    return {
      value: address,
      label: EXTERNAL_ACCOUNT_LABEL,
      isInternal: false
    };
  }
};

const SendToPrivateAddressSelect = () => {

  const internalAccountOptions = ['A7dm3...pcME339'];

  return (
    <SendToAddressSelect
      internalAccountOptions={internalAccountOptions}
      toReactSelectOption={toReactSelectOption}
      validateAddress={validatePrivateAddress}
    />
  );
};

export default SendToPrivateAddressSelect;
