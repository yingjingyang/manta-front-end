import React from 'react';
import Select from 'react-select';
import classNames from 'classnames';

const MantaSelect = ({ options, value, onChange, className, defaultValue }) => {
  return (
    <Select
      value={value}
      className={classNames('manta-select', className)}
      defaultValue={defaultValue}
      onChange={onChange} 
      isSearchable={false}
      classNamePrefix="manta"
      options={options}
    />
  );
};

export default MantaSelect;
