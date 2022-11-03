// @ts-nocheck
import React from 'react';
import { useBridgeData } from './BridgeContext/BridgeDataContext';

const BridgeFeeDisplay = () => {
  const {
    originFee,
    destinationFee
  } = useBridgeData();

  const originFeeText = originFee ? originFee.toFeeString() : '';
  const destinationFeeText = destinationFee ? destinationFee.toFeeString() : '';


  return (
    <div className="py-1">
      <div className="text-primary">{`Origin fee: ${originFeeText}`}</div>
      <div className="text-primary">{`Destination fee: ${destinationFeeText}`}</div>
    </div>
  );
};

export default BridgeFeeDisplay;
