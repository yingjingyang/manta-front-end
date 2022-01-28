import PublicPrivateToggle from 'pages/SendPage/PublicPrivateToggle';
import React from 'react';
import SendToAddressSelect from './SendToAddressSelect';

const SendToForm = () => {
  return (
    <div>
      <PublicPrivateToggle />
      <SendToAddressSelect />
    </div>
  );
};

export default SendToForm;
