import React from 'react';
import TabMenu from 'components/elements/TabMenu/TabMenu';
import TabMenuWrapper from 'components/elements/TabMenu/TabMenuWrapper';
import TabContentItemWrapper from 'components/elements/TabMenu/TabContentItemWrapper';
import { useTxStatus } from 'contexts/txStatusContext';
import PrivateSendTab from './PrivateSendTab';
import PrivateReceiveTab from './PrivateReceiveTab';
import ToPublicTab from './ToPublicTab';

const TABS = {
  Send: 0,
  Receive: 1,
  ToPublic: 2
};

const PrivateAssetTabs = () => {
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
          label="To Public"
          onClick={() => onClickTab(TABS.ToPublic)}
          active={selectedTabIndex === TABS.ToPublic}
          className="rounded-r-lg"
        />
      </TabMenuWrapper>
      <TabContentItemWrapper
        tabIndex={TABS.Send}
        currentTabIndex={selectedTabIndex}
      >
        <PrivateSendTab />
      </TabContentItemWrapper>
      <TabContentItemWrapper
        tabIndex={TABS.Receive}
        currentTabIndex={selectedTabIndex}
      >
        <PrivateReceiveTab />
      </TabContentItemWrapper>
      <TabContentItemWrapper
        tabIndex={TABS.ToPublic}
        currentTabIndex={selectedTabIndex}
      >
        <ToPublicTab />
      </TabContentItemWrapper>
    </>
  );
};

export default PrivateAssetTabs;
