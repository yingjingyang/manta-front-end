// @ts-nocheck
import NETWORK from 'constants/NetworkConstants';
import React from 'react';
import { TxStatusContextProvider } from 'contexts/txStatusContext';
import { SubstrateContextProvider } from 'contexts/substrateContext';
import Navbar from 'components/Navbar';
import { ExternalAccountContextProvider } from 'contexts/externalAccountContext';
import DeveloperConsole from 'components/Developer/DeveloperConsole';
import { ConfigContextProvider } from 'contexts/configContext';
import { StakeDataContextProvider } from './StakeContext/StakeDataContext';
import StakePageContent from './StakePageContent';
import { StakeTxContextProvider } from './StakeContext/StakeTxContext';

const StakePage = () => {

  return (
    <ConfigContextProvider network={NETWORK.CALAMARI}>
      <SubstrateContextProvider>
        <ExternalAccountContextProvider>
          <TxStatusContextProvider>
            <StakeDataContextProvider >
              <StakeTxContextProvider >
                <Navbar shouldShowZkAccount={false} />
                <StakePageContent />
                <DeveloperConsole />
              </StakeTxContextProvider>
            </StakeDataContextProvider>
          </TxStatusContextProvider>
        </ExternalAccountContextProvider>
      </SubstrateContextProvider >
    </ConfigContextProvider>
  );
};

export default StakePage;
