import React from 'react';
import Select from 'react-select';
import classNames from 'classnames';
import { useTxStatus } from 'contexts/txStatusContext';

const MantaSelect = ({ options, value, onChange, className, defaultValue }) => {
  const { txStatus } = useTxStatus();

  return (
    <Select
      value={value}
      className={classNames('manta-select', className)}
      defaultValue={defaultValue}
      onChange={onChange}
      isSearchable={false}
      classNamePrefix="manta"
      options={options}
      isDisabled={txStatus?.isProcessing()}
    />
  );
};

export default MantaSelect;
