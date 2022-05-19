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
    } else if (txStatus?.isFailed()) {
      showError('Transaction failed');
    }
  }, [txStatus]);

  return (
    <SendContextProvider>
      <PageContent>
        <Navbar />
        <div className="justify-center flex pb-2">
          <div className="px-3 sm:p-8 bg-secondary rounded-3xl">
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
