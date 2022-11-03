// @ts-nocheck
import React from 'react';
import { useBridgeData } from './BridgeContext/BridgeDataContext';
import MetamaskAccountDisplay from './MetamaskAccountDisplay';

const BridgeDestinationAccountDisplay = () => {
  const {
    destinationChain
  } = useBridgeData();

  return (
    <>
      {
        destinationChain.ethMetadata && <MetamaskAccountDisplay />
      }
    </>
  );
};

export default BridgeDestinationAccountDisplay;
