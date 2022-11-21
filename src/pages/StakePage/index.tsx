// @ts-nocheck
import React from 'react';
import { StakeDataContextProvider } from './StakeContext/StakeDataContext';
import StakePageContent from './StakePageContent';
import { StakeTxContextProvider } from './StakeContext/StakeTxContext';

const StakePage = () => {
  return (
      <StakeDataContextProvider >
        <StakeTxContextProvider >
          <StakePageContent />
        </StakeTxContextProvider>
      </StakeDataContextProvider>
  );
};

export default StakePage;
