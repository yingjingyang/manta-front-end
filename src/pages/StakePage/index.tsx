// @ts-nocheck
import React from 'react';
import { TxStatusContextProvider } from 'contexts/txStatusContext';
import DeveloperConsole from 'components/Developer/DeveloperConsole';
import { StakeDataContextProvider } from './StakeContext/StakeDataContext';
import StakePageContent from './StakePageContent';
import { StakeTxContextProvider } from './StakeContext/StakeTxContext';

const StakePage = () => {
  return (
    <TxStatusContextProvider>
      <StakeDataContextProvider >
        <StakeTxContextProvider >
          <StakePageContent />
          <DeveloperConsole />
        </StakeTxContextProvider>
      </StakeDataContextProvider>
    </TxStatusContextProvider>
  );
};

export default StakePage;
