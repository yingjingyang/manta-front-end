// @ts-nocheck
import React, { useEffect } from 'react';
import PageContent from 'components/PageContent';
import Navbar from 'components/Navbar';
import { useTxStatus } from 'contexts/txStatusContext';
import { showError, showSuccess } from 'utils/ui/Notifications';
import { MetamaskContextProvider } from 'contexts/metamaskContext';
import { BridgeContextProvider } from './BridgeContext';
import BridgeForm from './BridgeForm';

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
    <MetamaskContextProvider>
      <BridgeContextProvider>
        <PageContent>
          <Navbar />
          <BridgeForm />
        </PageContent>
      </BridgeContextProvider>
    </MetamaskContextProvider>
  );
};

export default BridgePage;
