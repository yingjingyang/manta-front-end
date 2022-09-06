// @ts-nocheck
import React from 'react';
import { useBridge } from './BridgeContext';
import MetamaskAccountDisplay from './MetamaskAccountDisplay';

const BridgeDestinationAccountDisplay = () => {
  const {
    destinationChain
  } = useBridge();

  return (
    <>
      {
        destinationChain.ethMetadata && <MetamaskAccountDisplay />
      }
    </>
  );
};

export default BridgeDestinationAccountDisplay;
