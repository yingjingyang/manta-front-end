import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './FormSwitch.css';

const FormSwitch = ({
  checked,
  name,
  onChange,
  disabled = false,
  onLabel,
  offLabel,
  className,
}) => {
  return (
    <label className={classNames('FormSwitch__switch', className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        name={name}
        disabled={disabled}
      />
      <span className="FormSwitch__slider round tracking-tight flex items-center justify-between text-sm border-gray-300 border text-white px-2 py-1">
        <span>{onLabel}</span>
        <span className="">{offLabel}</span>
      </span>
    </label>
  );
};

FormSwitch.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default FormSwitch;
