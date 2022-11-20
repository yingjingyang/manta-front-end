// @ts-nocheck
import React from 'react';
import { TxStatusContextProvider } from 'contexts/txStatusContext';
import { MetamaskContextProvider } from 'contexts/metamaskContext';
import BridgePageContent from './BridgePageContent';
import { BridgeDataContextProvider } from './BridgeContext/BridgeDataContext';
import { BridgeTxContextProvider } from './BridgeContext/BridgeTxContext';

const BridgePage = () => {
  return (
    <TxStatusContextProvider >
      <MetamaskContextProvider>
        <BridgeDataContextProvider>
          <BridgeTxContextProvider>
          {/* <div className='min-h-screen'> */}
            <BridgePageContent />
          {/* </div> */}
          </BridgeTxContextProvider>
        </BridgeDataContextProvider>
      </MetamaskContextProvider>
    </TxStatusContextProvider>
  );
};

export default BridgePage;
