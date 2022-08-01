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
    <div className="pt-5">
      <div className="text-primary">{`Origin fee: ${originFeeText}`}</div>
      <div className="text-primary">{`Destination fee: ${destinationFeeText}`}</div>
    </div>
  );
};

export default BridgeFeeDisplay;
