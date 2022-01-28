import React from 'react';
import TabMenu from 'components/elements/TabMenu/TabMenu';
import TabMenuWrapper from 'components/elements/TabMenu/TabMenuWrapper';
import TabContentItemWrapper from 'components/elements/TabMenu/TabContentItemWrapper';
import { useTxStatus } from 'contexts/txStatusContext';
import PublicSendTab from './PublicSendTab';
import PublicReceiveTab from './PublicReceiveTab';
import ToPrivateTab from './ToPrivateTab';

const TABS = {
  Send: 0,
  Receive: 1,
  ToPrivate: 2
};

const PublicAssetTabs = () => {
  const { selectedTabIndex, setSelectedTabIndex } = useSelectedTabIndex();
  const { txStatus } = useTxStatus();

  const onClickTab = (tab) => {
    if (txStatus?.isProcessing()) {
      return;
    }
    setSelectedTabIndex(tab);
  };

  return (
    <>
      <TabMenuWrapper className="pb-4">
        <TabMenu
          label="Send"
          onClick={() => onClickTab(TABS.Send)}
          active={selectedTabIndex === TABS.Send}
          className="rounded-l-lg"
        />
        <TabMenu
          label="Receive"
          onClick={() => onClickTab(TABS.Receive)}
          active={selectedTabIndex === TABS.Receive}
        />
        <TabMenu
          label="To Private"
          onClick={() => onClickTab(TABS.ToPrivate)}
          active={selectedTabIndex === TABS.ToPrivate}
          className="rounded-r-lg"
        />
      </TabMenuWrapper>
      <TabContentItemWrapper
        tabIndex={TABS.Send}
        currentTabIndex={selectedTabIndex}
      >
        <PublicSendTab />
      </TabContentItemWrapper>
      <TabContentItemWrapper
        tabIndex={TABS.Receive}
        currentTabIndex={selectedTabIndex}
      >
        <PublicReceiveTab />
      </TabContentItemWrapper>
      <TabContentItemWrapper
        tabIndex={TABS.ToPrivate}
        currentTabIndex={selectedTabIndex}
      >
        <ToPrivateTab />
      </TabContentItemWrapper>
    </>
  );
};

export default PublicAssetTabs;
