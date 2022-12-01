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
    getMaxSendableBalance
  } = useSend();
  const { signerIsConnected } = usePrivateWallet();
  const { isInitialSync } = usePrivateWallet();
  const shouldShowInitialSync = isInitialSync.current && senderIsPrivate();
  const shouldShowLoader =
    !senderAssetCurrentBalance &&
    api?.isConnected &&
    !shouldShowInitialSync &&
    signerIsConnected;

  const balanceText = shouldShowInitialSync
    ? 'Syncing to network'
    : senderAssetCurrentBalance?.toString();

  const [inputValue, setInputValue] = useState('');

  const onChangeSendAmountInput = (value) => {
    if (value === '') {
      setSenderAssetTargetBalance(null);
      setInputValue('');
    } else {
      try {
        const targetBalance = Balance.fromBaseUnits(
          senderAssetType,
          new Decimal(value)
        );
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
    const maxSendableBalance = getMaxSendableBalance();
    if (maxSendableBalance) {
      onChangeSendAmountInput(maxSendableBalance.toString());
    }
  };

  return (
    <BalanceInput
      onChangeAmountInput={onChangeSendAmountInput}
      inputValue={inputValue}
      onClickMax={onClickMax}
      balanceText={balanceText}
      shouldShowLoader={shouldShowLoader}
    />
  );
};

export default SendBalanceInput;
