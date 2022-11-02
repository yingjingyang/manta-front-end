// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useTxStatus } from 'contexts/txStatusContext';
import GradientText from 'components/GradientText';
import BalanceComponent from 'components/Balance';

const BalanceInput = ({
  onChangeAmountInput,
  inputValue,
  onClickMax,
  balanceText,
  shouldShowLoader
}) => {
  const { txStatus } = useTxStatus();
  const disabled = txStatus?.isProcessing();

  return (
    <div
      className={classNames(
        'flex flex-col w-full rounded-2xl manta-bg-gray content-around justify-center h-24',
        { disabled: disabled }
      )}
    >
      <div className="flex justify-items-center">
        <input
          id="amountInput"
          onChange={(e) => onChangeAmountInput(e.target.value)}
          className={classNames(
            'w-full pl-3 pt-1 text-4xl font-bold text-black dark:text-white manta-bg-gray outline-none rounded-2xl',
            { disabled: disabled }
          )}
          value={inputValue}
          disabled={disabled}
        />
        <MaxButton
          id="maxAmount"
          isDisabled={disabled}
          onClickMax={onClickMax}
        />
      </div>
      <BalanceComponent
        balance={balanceText}
        className="w-full text-xs manta-gray mt-2.5 pl-3"
        loaderClassName="text-manta-gray border-manta-gray bg-manta-gray"
        loader={shouldShowLoader}
      />
    </div>
  );
};

BalanceInput.propTypes = {
  onChangeAmountInput: PropTypes.func,
  inputValue: PropTypes.string,
  onClickMax: PropTypes.func,
  balanceText: PropTypes.string,
  shouldShowLoader: PropTypes.bool
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
        'text-center rounded-2xl unselectable-text absolute right-6 bottom-1 flex items-center text-xss font-semibold manta-gray',
        { disabled: isDisabled }
      )}
    >
      Send&nbsp; <GradientText text="Max Amount" />
    </span>
  );
};

MaxButton.propTypes = {
  onClickMax: PropTypes.func,
  disabled: PropTypes.bool
};


export default BalanceInput;
