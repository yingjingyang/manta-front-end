import PublicFromAccountSelect from 'components/Navbar/PublicFromAccountSelect';
import PublicPrivateToggle from 'pages/SendPage/PublicPrivateToggle';
import React from 'react';
import SendAssetSelect from './SendAssetSelect';

const SendFromForm = () => {
  return (
    <div>
      <PublicPrivateToggle  />
      <PublicFromAccountSelect />
      <SendAssetSelect />
    </div>
  );
};

export default SendFromForm;
