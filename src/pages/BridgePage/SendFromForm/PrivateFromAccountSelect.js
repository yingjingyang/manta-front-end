import React, { useState } from 'react';
import Select, { components } from 'react-select';

const PrivateFromAccountSelect = () => {
  // todo: check user actually has private account
  const defaultOption = {
    value: 'My private account',
    label: 'My private account'
  };
  const options = useState([defaultOption]);

  const onChangeOption = () => {
    return;
  };

  return (
    <div className="py-5 pl-2 text-lg text-primary">
      My private account
    </div>
  );
};

export default PrivateFromAccountSelect;
