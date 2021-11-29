import React, { useState } from 'react';
import TabMenu from 'components/elements/TabMenu/TabMenu';
import TabMenuWrapper from 'components/elements/TabMenu/TabMenuWrapper';
import PropTypes from 'prop-types';
import AssetType from 'types/AssetType';
import TabContentItemWrapper from 'components/elements/TabMenu/TabContentItemWrapper';
import { useTxStatus } from 'contexts/txStatusContext';
import NativeTokenSendTab from './NativeTokenSendTab';
import NativeTokenReceiveTab from './NativeTokenReceiveTab';

const TABS = {
  Send: 'send',
  Receive: 'receive',
};

const NativeTokenTabs = ({ selectedAssetType }) => {
  const [selectedTabIdx, setSelectedTabIdx] = useState(TABS.Send);

  const { txStatus } = useTxStatus();

  const onClickTab = (tab) => {
    if (txStatus?.isProcessing()) {
      return;
    }
    setSelectedTabIdx(tab);
  };

  return (
    <>
      <TabMenuWrapper className="pb-4">
        <TabMenu
          label="Send"
          onClick={() => onClickTab(TABS.Send)}
          active={selectedTabIdx === TABS.Send}
          className="rounded-l-lg"
        />
        <TabMenu
          label="Receive"
          onClick={() => onClickTab(TABS.Receive)}
          active={selectedTabIdx === TABS.Receive}
          className="rounded-r-lg"
        />
      </TabMenuWrapper>
      <TabContentItemWrapper
        tabIndex={TABS.Send}
        currentTabIndex={selectedTabIdx}
      >
        <NativeTokenSendTab selectedAssetType={selectedAssetType} />
      </TabContentItemWrapper>
      <TabContentItemWrapper
        tabIndex={TABS.Receive}
        currentTabIndex={selectedTabIdx}
      >
        <NativeTokenReceiveTab selectedAssetType={selectedAssetType} />
      </TabContentItemWrapper>
    </>
  );
};

NativeTokenTabs.propTypes = {
  selectedAssetType: PropTypes.instanceOf(AssetType),
};

export default NativeTokenTabs;
