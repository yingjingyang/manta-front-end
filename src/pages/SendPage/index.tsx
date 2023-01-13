// @ts-nocheck
import React from 'react';
import PageContent from 'components/PageContent';
import Navbar from 'components/Navbar';
import { SendContextProvider } from './SendContext';
import SendForm from './SendForm';

const SendPage = () => {
  return (
    <SendContextProvider>
      <Navbar showZkBtn={true} />
      <PageContent>
        <SendForm />
      </PageContent>
    </SendContextProvider>
  );
};

export default SendPage;
