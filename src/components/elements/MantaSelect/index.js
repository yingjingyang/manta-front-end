import React from 'react';
import Select from 'react-select';
import classNames from 'classnames';
import { useTxStatus } from 'contexts/txStatusContext';
import PropTypes from 'prop-types';

const MantaSelect = ({ options, onChange, className, defaultValue }) => {
  const { txStatus } = useTxStatus();

  return (
    <Select
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

MantaSelect.propTypes = {
  options: PropTypes.object,
  onChange: PropTypes.func,
  className: PropTypes.string,
  defaultValue: PropTypes.object
};

export default MantaSelect;
