import React from 'react';
import PageContent from 'components/PageContent';
import Navbar from 'components/Navbar';
import Svgs from 'resources/icons';
import SendFromForm from './SendFromForm';
import SendToForm from './SendToForm';
import { SendContextProvider } from './SendContext';


const SendPage = () => {
  return (
    <SendContextProvider >
      <PageContent>
        <Navbar />
        <div className="justify-center flex pt-4 pb-4">
          <div className="px-3 py-2 sm:p-8 bg-secondary rounded-lg">
            <h1 className="text-2xl pb-2 mb-0 font-semibold text-accent">
              Send
            </h1>
            <SendFromForm />
            <img
              className="mx-auto py-4"
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
