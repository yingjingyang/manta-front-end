// @ts-nocheck
import React, { useState } from 'react';
import PageContent from 'components/PageContent';
import Navbar from 'components/Navbar';
import { GovernCard } from 'pages/Wireframes/resources/Govern';
import TabMenuWrapper from 'components/TabMenu/TabMenuWrapper';
import TabMenu from 'components/TabMenu/TabMenu';
import TabContentItemWrapper from 'components/TabMenu/TabContentItemWrapper';

const TABS = {
  Open: 'open',
  Closed: 'closed',
};

const GovernPage = () => {
  const [selectedTabIdx, setSelectedTabIdx] = useState(TABS.Open);

  return (
    <PageContent className="lg:justify-start">
      <Navbar />
      <div className="flex h-full justify-center pt-20 lg:pt-8 pb-4">
        <div className="w-full lg:w-5/6 bg-secondary p-4 sm:p-10 rounded-lg">
          <div className="pb-6 flex flex-col sm:flex-row justify-between sm:items-center">
            <h1 className="text-3xl pb-5 sm:pb-0 font-semibold text-accent">
              Govern (coming soon)
            </h1>
            <TabMenuWrapper className="sm:w-80">
              <TabMenu
                label="Open"
                onClick={() => setSelectedTabIdx(TABS.Open)}
                active={selectedTabIdx === TABS.Open}
                className="rounded-l-lg"
              />
              <TabMenu
                label="Closed"
                onClick={() => setSelectedTabIdx(TABS.Closed)}
                active={selectedTabIdx === TABS.Closed}
                className="rounded-r-lg"
              />
            </TabMenuWrapper>
          </div>
          <TabContentItemWrapper
            tabIndex={TABS.Open}
            currentTabIndex={selectedTabIdx}
          >
            <GovernCard />
          </TabContentItemWrapper>
          <TabContentItemWrapper
            tabIndex={TABS.Closed}
            currentTabIndex={selectedTabIdx}
          >
            <GovernCard />
          </TabContentItemWrapper>
        </div>
      </div>
    </PageContent>
  );
};

export default GovernPage;
