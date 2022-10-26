// @ts-nocheck
import React, { useEffect } from 'react';
import PageContent from 'components/PageContent';
import Navbar from 'components/Navbar';
import { useTxStatus } from 'contexts/txStatusContext';
import { showError, showSuccess } from 'utils/ui/Notifications';
import { MetamaskContextProvider } from 'contexts/metamaskContext';
import { BridgeContextProvider } from './BridgeContext';
import BridgeForm from './BridgeForm';
import BridgePageContent from './BridgePageContent';

const BridgePage = () => {
  const { txStatus, setTxStatus } = useTxStatus();

  useEffect(() => {
    if (txStatus?.isFinalized()) {
      showSuccess('Transaction finalized', txStatus?.extrinsic);
      setTxStatus(null);
    } else if (txStatus?.isFailed()) {
      showError('Transaction failed');
      setTxStatus(null);
    }
  }, [txStatus]);

  return (
    <ConfigContextProvider network={NETWORK.CALAMARI}>
      <SubstrateContextProvider>
        <ExternalAccountContextProvider>
          <TxStatusContextProvider >
          <MetamaskContextProvider>
            <BridgeContextProvider>
              <BridgePageContent />
            </BridgeContextProvider>
          </MetamaskContextProvider>
          </TxStatusContextProvider>
        </ExternalAccountContextProvider>
      </SubstrateContextProvider>
    </ConfigContextProvider>
  );
};

export default BridgePage;
