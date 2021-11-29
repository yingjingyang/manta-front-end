import React, { useState } from 'react';
import TabMenu from 'components/elements/TabMenu/TabMenu';
import TabMenuWrapper from 'components/elements/TabMenu/TabMenuWrapper';
import PropTypes from 'prop-types';
import AssetType from 'types/AssetType';
import TabContentItemWrapper from 'components/elements/TabMenu/TabContentItemWrapper';
import { useTxStatus } from 'contexts/txStatusContext';
import PublicSendTab from './PublicSendTab';
import PublicReceiveTab from './PublicReceiveTab';
import ToPrivateTab from './ToPrivateTab';

const TABS = {
  Receive: 'receive',
  Send: 'send',
  ToPrivate: 'toPrivate',
};

const PublicAssetTabs = ({ selectedAssetType }) => {
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
        />
        <TabMenu
          label="To Private"
          onClick={() => onClickTab(TABS.ToPrivate)}
          active={selectedTabIdx === TABS.ToPrivate}
          className="rounded-r-lg"
        />
      </TabMenuWrapper>
      <TabContentItemWrapper
        tabIndex={TABS.Send}
        currentTabIndex={selectedTabIdx}
      >
        <PublicSendTab selectedAssetType={selectedAssetType} />
      </TabContentItemWrapper>
      <TabContentItemWrapper
        tabIndex={TABS.Receive}
        currentTabIndex={selectedTabIdx}
      >
        <PublicReceiveTab selectedAssetType={selectedAssetType} />
      </TabContentItemWrapper>
      <TabContentItemWrapper
        tabIndex={TABS.ToPrivate}
        currentTabIndex={selectedTabIdx}
      >
        <ToPrivateTab selectedAssetType={selectedAssetType} />
      </TabContentItemWrapper>
    </>
  );
};

PublicAssetTabs.propTypes = {
  selectedAssetType: PropTypes.instanceOf(AssetType),
};

export default PublicAssetTabs;
