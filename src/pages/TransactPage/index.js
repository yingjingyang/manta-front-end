import React, { useState } from 'react';
import { PageContent, Navbar } from 'components/elements/Layouts';
import TabMenuWrapper from 'components/elements/TabMenu/TabMenuWrapper';
import TabMenu from 'components/elements/TabMenu/TabMenu';
import TabContentItemWrapper from 'components/elements/TabMenu/TabContentItemWrapper';
import SendContent from 'components/resources/Transact/SendContent';
import ReceiveContent from 'components/resources/Transact/ReceiveContent';

const TABS = {
  Receive: 'receive',
  Send: 'send',
};

const TransactPage = () => {
  const [selectedTabIdx, setSelectedTabIdx] = useState(TABS.Send);

  return (
    <PageContent>
      <Navbar />
      <div className="flex justify-center pt-20 lg:pt-12 pb-4">
        <div className="w-full md:w-2/3 lg:w-1/3 lg:min-w-layout p-4 sm:p-8 bg-secondary rounded-lg">
          <h1 className="text-3xl pb-6 mb-0 font-semibold text-accent">Transact</h1>
          <TabMenuWrapper className="pb-4">
            <TabMenu
              label="Send"
              onClick={() => setSelectedTabIdx(TABS.Send)}
              active={selectedTabIdx === TABS.Send}
              className="rounded-l-lg"
            />
            <TabMenu
              label="Receive"
              onClick={() => setSelectedTabIdx(TABS.Receive)}
              active={selectedTabIdx === TABS.Receive}
              className="rounded-r-lg"
            />
          </TabMenuWrapper>
          <TabContentItemWrapper tabIndex={TABS.Send} currentTabIndex={selectedTabIdx}>
            <SendContent />
          </TabContentItemWrapper>
          <TabContentItemWrapper tabIndex={TABS.Receive} currentTabIndex={selectedTabIdx}>
            <ReceiveContent />
          </TabContentItemWrapper>
        </div>
      </div>
      <div className="hidden lg:block h-10" />
    </PageContent>
  );
};

export default TransactPage;
