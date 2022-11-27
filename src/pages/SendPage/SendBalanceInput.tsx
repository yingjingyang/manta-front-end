// @ts-nocheck
import React, { useState } from 'react';
import Balance from 'types/Balance';
import Decimal from 'decimal.js';
import BN from 'bn.js';
import { useSubstrate } from 'contexts/substrateContext';
import { useSend } from 'pages/SendPage/SendContext';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import BalanceInput from '../../components/Balance/BalanceInput';

const SendBalanceInput = () => {
  const { api } = useSubstrate();
  const {
    senderAssetCurrentBalance,
    setSenderAssetTargetBalance,
    senderAssetType,
    senderIsPrivate,
    senderInputValue,
    setSenderInputValue,
    getMaxSendableBalance
  } = useSend();
  const { isInitialSync } = usePrivateWallet();
  const shouldShowInitialSync = isInitialSync.current && senderIsPrivate();
  const shouldShowLoader =
    !senderAssetCurrentBalance && api?.isConnected && !shouldShowInitialSync;
  const balanceText = shouldShowInitialSync
    ? 'Syncing to network'
    : senderAssetCurrentBalance?.toString();

  const onChangeSendAmountInput = (value) => {
    if (value === '') {
      setSenderAssetTargetBalance(null);
      setSenderInputValue('');
    } else {
      try {
        const targetBalance = Balance.fromBaseUnits(
          senderAssetType,
          new Decimal(value)
        );
        setSenderInputValue(value);
        if (targetBalance.valueAtomicUnits.gt(new BN(0))) {
          setSenderAssetTargetBalance(targetBalance);
        } else {
          setSenderAssetTargetBalance(null);
        }
      } catch (error) {}
    }
  };

  const onClickMax = () => {
    const maxSendableBalance = getMaxSendableBalance();
    if (maxSendableBalance) {
      onChangeSendAmountInput(maxSendableBalance.toString());
    }
  };

  return (
    <BalanceInput
      onChangeAmountInput={onChangeSendAmountInput}
      inputValue={senderInputValue}
      onClickMax={onClickMax}
      balanceText={balanceText}
      shouldShowLoader={shouldShowLoader}
    />
  );
};

export default SendBalanceInput;
