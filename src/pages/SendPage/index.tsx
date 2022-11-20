// @ts-nocheck
import React from 'react';
import { TxStatusContextProvider } from 'contexts/txStatusContext';
import { PrivateWalletContextProvider } from 'contexts/privateWalletContext';
import { SendContextProvider } from './SendContext';
import SendPageContent from './SendPageContent';

const SendPage = () => {
  return (
    <TxStatusContextProvider >
      <PrivateWalletContextProvider>
        <SendContextProvider>
          <SendPageContent />
        </SendContextProvider>
      </PrivateWalletContextProvider>
    </TxStatusContextProvider>
  );
};

export default SendPage;
