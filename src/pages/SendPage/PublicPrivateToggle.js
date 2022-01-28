import classNames from 'classnames';
import { useTxStatus } from 'contexts/txStatusContext';
import React from 'react';
import PropTypes from 'prop-types';

const PublicPrivateToggle = ({isPrivate, onToggle, label}) => {
  const { txStatus } = useTxStatus();
  const disabled = txStatus?.isProcessing();

  return (
    <div className="flex pb-2 mr-12 justify-center items-center">
      <label className="text-primary">
        {label}
      </label>
      <span
        onClick={!disabled && onToggle}
        className={
          classNames(
            'py-2 pr-1 ml-2 cursor-pointer btn-hover unselectable-text',
            'text-center rounded-lg btn-primary w-24',
            {'disabled': disabled}
          )}
      >
        {isPrivate ? '🤿Private' : '🏖️Public'}
      </span>
    </div>
  );
};

PublicPrivateToggle.propTypes = {
  isPrivate: PropTypes.bool,
  onToggle: PropTypes.func,
  label: PropTypes.string
};

export default PublicPrivateToggle;
