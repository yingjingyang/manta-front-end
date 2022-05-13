// @ts-nocheck
import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useTxStatus } from 'contexts/txStatusContext';
import getBalanceString from 'utils/ui/getBalanceString';
import GradientText from 'components/GradientText';
import Balance from 'types/Balance';
import Decimal from 'decimal.js';
import BN from 'bn.js';
import { useSend } from '../SendContext';

const SendAmountInput = () => {
  const {
    senderAssetCurrentBalance,
    setSenderAssetTargetBalance,
    senderAssetType,
    getMaxSendableBalance
  } = useSend();
  const balanceText = getBalanceString(senderAssetCurrentBalance);
  const { txStatus } = useTxStatus();
  const disabled = txStatus?.isProcessing();
  const [inputValue, setInputValue] = useState('');

  const onChangeSendAmountInput = (value) => {
    if (value === '') {
      setSenderAssetTargetBalance(null);
      setInputValue('');
    } else {
      try {
        const targetBalance = Balance.fromBaseUnits(senderAssetType, new Decimal(value));
        setInputValue(value);
        if (targetBalance.valueAtomicUnits.gt(new BN(0))) {
          setSenderAssetTargetBalance(targetBalance);
        } else {
          setSenderAssetTargetBalance(null);
        }
      } catch (error) {}
    }
  };

  const onClickMax = () => {
    const maxAmount = getMaxSendableBalance();
    onChangeSendAmountInput(maxAmount.toString());
  };

  return (
    <div
      className={classNames(
        'flex flex-col w-full rounded-2xl manta-bg-gray content-around justify-center h-24',
        { disabled: disabled }
      )}
    >
      <div className="flex justify-items-center">
        <input
          onChange={(e) => onChangeSendAmountInput(e.target.value)}
          className={classNames(
            'w-full pl-3 pt-1 text-4xl font-bold text-black dark:text-white manta-bg-gray outline-none rounded-2xl',
            { disabled: disabled }
          )}
          value={inputValue}
          disabled={disabled}
        />
        <MaxButton isDisabled={disabled} onClickMax={onClickMax} />
      </div>
      <div className="w-full text-xs manta-gray mt-2.5 pl-3">{balanceText}</div>
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

const MaxButton = ({ onClickMax, isDisabled }) => {
  const onClick = () => {
    !isDisabled && onClickMax();
  };
  return (
    <span
      onClick={onClick}
      className={classNames(
        'cursor-pointer',
        'text-center rounded-2xl unselectable-text absolute right-6 bottom-1 flex gap-1 items-center text-xss font-semibold manta-gray',
        { disabled: isDisabled }
      )}
    >
      Send <GradientText text="Max Amount" />
    </span>
  );
};

MaxButton.propTypes = {
  onClickMax: PropTypes.func,
  disabled: PropTypes.bool
};

export default SendAmountInput;
