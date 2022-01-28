import React from 'react';
import PageContent from 'components/PageContent';
import Navbar from 'components/Navbar';
import Svgs from 'resources/icons';
import SendButton from './SendButton';
import SendFromForm from './SendFromForm';
import SendToForm from './SendToForm';


const SendPage = () => {
  return (
    <PageContent>
      <Navbar />
      <div className="flex justify-center mt-2 pt-4 pb-4">
        <div className="min-w-layout p-3 sm:p-8 bg-secondary rounded-lg">
          <h1 className="text-2xl pb-4 mb-0 font-semibold text-accent">
            Send
          </h1>
          <SendFromForm />
          <img
            className="mx-auto py-4"
            src={Svgs.ArrowDownIcon}
            alt="switch-icon"
          />
          <SendToForm />
          <SendButton />
        </div>
      </div>
    </PageContent>
  );
};

export default SendPage;
