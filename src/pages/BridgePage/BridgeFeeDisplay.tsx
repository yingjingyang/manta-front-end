// @ts-nocheck
import React from 'react';
import { useBridge } from './BridgeContext';

const BridgeFeeDisplay = () => {
  const {
    senderAssetType,
    originFee,
    destinationFee
  } = useBridge();

  return (
    <div className='pt-3'>
      <div>{`Origin fee: 0 ${originFee?.assetType.ticker}`}</div>
      <div>{`Destination fee: 0 ${destinationFee?.assetType.ticker}`}</div>
    </div>
  );
};

export default BridgeFeeDisplay;
