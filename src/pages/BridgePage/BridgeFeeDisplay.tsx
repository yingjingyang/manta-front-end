// @ts-nocheck
import React from 'react';
import { useBridge } from './BridgeContext';

const BridgeFeeDisplay = () => {
  const {
    originFee,
    destinationFee
  } = useBridge();

  const originFeeText = originFee ? originFee.toFeeString() : '';
  const destinationFeeText = destinationFee ? destinationFee.toFeeString() : '';


  return (
    <div className="pt-3">
      <div>{`Origin fee: ${originFeeText}`}</div>
      <div>{`Destination fee: ${destinationFeeText}`}</div>
    </div>
  );
};

export default BridgeFeeDisplay;
