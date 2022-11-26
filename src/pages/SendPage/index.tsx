// @ts-nocheck
import React from 'react';
import { PrivateWalletContextProvider } from 'contexts/privateWalletContext';
import { SendContextProvider } from './SendContext';
import PageContent from 'components/PageContent';
import SendForm from './SendForm';

const SendPage = () => {
  return (
      <PrivateWalletContextProvider>
        <SendContextProvider>
          <PageContent>
            <SendForm />
          </PageContent>
        </SendContextProvider>
      </PrivateWalletContextProvider>
  );
};

export default SendPage;
