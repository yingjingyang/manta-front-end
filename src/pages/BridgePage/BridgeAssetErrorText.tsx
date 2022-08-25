// @ts-nocheck
import React from 'react';
import FormErrorText from 'components/Error/FormErrorText';
import { useBridge } from './BridgeContext';

const BridgeAssetErrorText = () => {
  const {
    txIsOverMinAmount,
    userHasSufficientFunds,
    senderAssetType,
    minInput
  } = useBridge();

  let errorText = null;
  if (userHasSufficientFunds() === false) {
    errorText = 'Insufficient balance'
  } else if (txIsOverMinAmount() === false) {
    errorText = `Minimum ${senderAssetType.ticker} transaction is ${minInput.toFeeString()}`
  }

  return (
    <div className='pt-1'>
      <FormErrorText errorText={errorText}/>
    </div>
  )
}

export default BridgeAssetErrorText;
