// @ts-nocheck
import React, { useEffect } from 'react';
import PageContent from 'components/PageContent';
import Navbar from 'components/Navbar';
import Svgs from 'resources/icons';
import { showError, showSuccess } from 'utils/ui/Notifications';
import { useTxStatus } from 'contexts/txStatusContext';
import SendFromForm from './SendFromForm';
import SendToForm from './SendToForm';
import { SendContextProvider } from './SendContext';

const SendPage = () => {
  const { txStatus } = useTxStatus();

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
    <SendContextProvider>
      <PageContent>
        <Navbar />
        <div className="absolute inset-y-0 inset-x-0 lg:left-32 2xl:inset-x-0 justify-center flex items-center pb-2">
          <div className="p-8 bg-secondary rounded-3xl">
            <SendFromForm />
            <img
              className="mx-auto pt-1 pb-4"
              src={Svgs.ArrowDownIcon}
              alt="switch-icon"
            />
            <SendToForm />
          </div>
        </div>
      </PageContent>
    </SendContextProvider>
  );
};

export default SendPage;
