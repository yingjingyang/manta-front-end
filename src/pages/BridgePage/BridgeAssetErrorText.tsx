// @ts-nocheck
import React from 'react';
import FormErrorText from 'components/Error/FormErrorText';
import { useBridgeData } from './BridgeContext/BridgeDataContext';
import { useBridgeTx } from './BridgeContext/BridgeTxContext';

const BridgeAssetErrorText = () => {
  const { senderAssetType, minInput } = useBridgeData();
  const { txIsOverMinAmount, userHasSufficientFunds} = useBridgeTx();

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
