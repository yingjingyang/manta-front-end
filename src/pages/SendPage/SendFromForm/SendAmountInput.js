import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useTxStatus } from 'contexts/txStatusContext';
import getBalanceString from 'utils/ui/getBalanceString';
import { useSend } from '../SendContext';

const SendAmountInput = ({
  onChange,
  value,
  onClickMax,
  isDisabled,
}) => {
  const { senderAssetCurrentBalance } = useSend();
  const balanceText = getBalanceString(senderAssetCurrentBalance);
  const { txStatus } = useTxStatus();
  const disabled = isDisabled || txStatus?.isProcessing();

  return (
    <div
      className={classNames(
        'flex flex-col w-60 rounded-r-lg manta-bg-gray content-around justify-center',
        {'disabled': disabled}
      )}
    >
      <div className="flex justify-items-center">
        <input
          type="number"
          onChange={onChange}
          className={classNames(
            'w-full pl-3 pt-1 text-lg manta-bg-gray outline-none',
            {'disabled': disabled}
          )}
          value={value}
          disabled={disabled}
        />
        <MaxButton
          isDisabled={disabled}
          onC
          lickMax={onClickMax}
        />
      </div>
      <div className="w-full text-xs manta-gray mt-0.5 pl-3">{balanceText}</div>
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
          'mr-4 pl-5 pr-5 my-1 cursor-pointer btn-hover',
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
