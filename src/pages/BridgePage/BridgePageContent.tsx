import React, { useEffect } from 'react';
import PageContent from 'components/PageContent';
import { useTxStatus } from 'contexts/txStatusContext';
import { showError, showSuccess } from 'utils/ui/Notifications';
import BridgeForm from './BridgeForm';
import { useBridgeData } from './BridgeContext/BridgeDataContext';

const BridgePageContent = () => {
  const { txStatus, setTxStatus } = useTxStatus();
  const { originChain } = useBridgeData();

  useEffect(() => {
    if (txStatus?.isFinalized()) {
      showSuccess(originChain.subscanUrl, 'Transaction finalized', txStatus?.extrinsic);
      setTxStatus(null);
    } else if (txStatus?.isFailed()) {
      showError('Transaction failed');
      setTxStatus(null);
    }
  }, [txStatus]);

  return (
        <PageContent>
          <BridgeForm />
        </PageContent>
  );
};

export default BridgePageContent;
