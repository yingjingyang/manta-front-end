import React, { useEffect } from 'react';
import TabMenu from 'components/elements/TabMenu/TabMenu';
import TabMenuWrapper from 'components/elements/TabMenu/TabMenuWrapper';
import TabContentItemWrapper from 'components/elements/TabMenu/TabContentItemWrapper';
import { useTxStatus } from 'contexts/txStatusContext';
import { useSelectedTabIndex } from 'contexts/selectedTabContext';
import NativeTokenSendTab from './NativeTokenSendTab';
import NativeTokenReceiveTab from './NativeTokenReceiveTab';

const TABS = {
  Send: 0,
  Receive: 1
};

const NativeTokenTabs = () => {
  const { selectedTabIndex, setSelectedTabIndex } = useSelectedTabIndex();

  // Other pages have a third tab, not this, because you can't privatize
  // the native token (yet)
  useEffect(() => {
    const NATIVE_TOKEN_MAX_TAB_INDEX = 1;
    if (selectedTabIndex > NATIVE_TOKEN_MAX_TAB_INDEX) {
      setSelectedTabIndex(TABS.Send);
    }
  });
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
          className="rounded-r-lg"
        />
      </TabMenuWrapper>
      <TabContentItemWrapper
        tabIndex={TABS.Send}
        currentTabIndex={selectedTabIndex}
      >
        <NativeTokenSendTab />
      </TabContentItemWrapper>
      <TabContentItemWrapper
        tabIndex={TABS.Receive}
        currentTabIndex={selectedTabIndex}
      >
        <NativeTokenReceiveTab />
      </TabContentItemWrapper>
    </>
  );
};

export default NativeTokenTabs;
