// @ts-nocheck
import React from 'react';
import { MetamaskContextProvider } from 'contexts/metamaskContext';
import { BridgeDataContextProvider } from './BridgeContext/BridgeDataContext';
import { BridgeTxContextProvider } from './BridgeContext/BridgeTxContext';
import PageContent from 'components/PageContent';
import BridgeForm from './BridgeForm';

const BridgePage = () => {
  return (
      <MetamaskContextProvider>
        <BridgeDataContextProvider>
          <BridgeTxContextProvider>
            <PageContent>
              <BridgeForm />
            </PageContent>
          </BridgeTxContextProvider>
        </BridgeDataContextProvider>
      </MetamaskContextProvider>
  );
};

export default BridgePage;
