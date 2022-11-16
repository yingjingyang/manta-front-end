// @ts-nocheck
import React from 'react';
import { TxStatusContextProvider } from 'contexts/txStatusContext';
import { MetamaskContextProvider } from 'contexts/metamaskContext';
import BridgePageContent from './BridgePageContent';
import NETWORK from 'constants/NetworkConstants';
import { ConfigContextProvider } from 'contexts/configContext';
import { SubstrateContextProvider } from 'contexts/substrateContext';
import { ExternalAccountContextProvider } from 'contexts/externalAccountContext';
import Navbar from 'components/Navbar';
import { BridgeDataContextProvider } from './BridgeContext/BridgeDataContext';
import { BridgeTxContextProvider } from './BridgeContext/BridgeTxContext';

const BridgePage = () => {
  return (
    <ConfigContextProvider network={NETWORK.CALAMARI}>
      <SubstrateContextProvider>
        <ExternalAccountContextProvider>
          <TxStatusContextProvider >
            <MetamaskContextProvider>
              <BridgeDataContextProvider>
                <BridgeTxContextProvider>
                <div className='min-h-screen'>
                  <Navbar shouldShowZkAccount={false}/>
                  <BridgePageContent />
                </div>
                </BridgeTxContextProvider>
              </BridgeDataContextProvider>
            </MetamaskContextProvider>
          </TxStatusContextProvider>
        </ExternalAccountContextProvider>
      </SubstrateContextProvider>
    </ConfigContextProvider>
  );
};

export default BridgePage;
