// @ts-nocheck
import React from 'react';
import FormErrorText from 'components/Error/FormErrorText';
import { useBridgeData } from './BridgeContext/BridgeDataContext';
import { useBridgeTx } from './BridgeContext/BridgeTxContext';

const BridgeAssetErrorText = () => {
  const { senderAssetType, minInput, originChain } = useBridgeData();
  const { txIsOverMinAmount, userHasSufficientFunds, userCanPayOriginFee} = useBridgeTx();

  let errorText = null;
  if (userHasSufficientFunds() === false) {
    errorText = 'Insufficient balance'
  } else if (userCanPayOriginFee() === false) {
    errorText = `Insufficient ${originChain.nativeAsset.ticker} to pay origin fee`;
  } else if (txIsOverMinAmount() === false) {
    const MIN_INPUT_DIGITS = 6;
    errorText = `Minimum ${senderAssetType.ticker} transaction is ${minInput.toDisplayString(MIN_INPUT_DIGITS)}`
  }

  return (
    <div className='pt-1'>
      <FormErrorText errorText={errorText}/>
    </div>
  )
}

export default BridgeAssetErrorText;
