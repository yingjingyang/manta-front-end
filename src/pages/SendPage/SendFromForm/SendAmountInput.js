import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useTxStatus } from 'contexts/txStatusContext';

const SendAmountInput = ({
  balanceText = 'Balance: 1000 BTC',
  onChange,
  value,
  onClickMax,
  isDisabled,
}) => {
  const { txStatus } = useTxStatus();
  const disabled = isDisabled || txStatus?.isProcessing();

  return (
    <div
      className={classNames(
        'flex items-start w-60 py-2 rounded-r-lg manta-bg-gray',
        {'disabled': disabled}
      )}
    >
      <div className="width-full">
        <input
          type="number"
          onChange={onChange}
          className={classNames(
            'w-full pl-3 text-lg manta-bg-gray outline-none',
            {'disabled': disabled}
          )}
          value={value}
          disabled={disabled}
        />
        <div className="w-full text-sm manta-gray pl-3">{balanceText}</div>
      </div>

      <MaxButton
        isDisabled={disabled}
        onC
        lickMax={onClickMax}
      />

    </div>
  );
};

SendAmountInput.propTypes = {
  balanceText: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.any,
  onClickMax: PropTypes.func,
  isDisabled: PropTypes.bool
};

const MaxButton = ({onClickMax, disabled}) => {
  return (
    <span
      onClick={!disabled && onClickMax}
      className={
        classNames(
          'py-0.5 mr-2 pl-5 pr-5 cursor-pointer btn-hover',
          'text-center rounded-lg btn-primary unselectable-text',
          {'disabled': disabled}
        )}
    >
      MAX
    </span>
  );
};

MaxButton.propTypes = {
  onClickMax: PropTypes.func,
  disabled: PropTypes.bool
};

export default SendAmountInput;
