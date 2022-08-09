// @ts-nocheck
import { useMetamask } from 'contexts/metamaskContext';
import React from 'react';

const MetamaskAccountDisplay = () => {
  const { ethAddress } = useMetamask();

  return (
    <>
      {
        ethAddress
          ? <div>{ethAddress}</div>
          : <div>Metamask must be connected</div>
      }
    </>
  );
};

export default MetamaskAccountDisplay;
