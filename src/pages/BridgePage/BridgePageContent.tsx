import React, { useEffect } from 'react';
import PageContent from 'components/PageContent';
import { useTxStatus } from 'contexts/txStatusContext';
import { showError, showSuccess } from 'utils/ui/Notifications';
import BridgeForm from './BridgeForm';
import { useConfig } from 'contexts/configContext';

const BridgePageContent = () => {
  const config = useConfig();
  const { txStatus, setTxStatus } = useTxStatus();

  useEffect(() => {
    if (txStatus?.isFinalized()) {
      showSuccess(config, 'Transaction finalized', txStatus?.extrinsic);
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
