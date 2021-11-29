import React, { useState } from 'react';
import TabMenu from 'components/elements/TabMenu/TabMenu';
import TabMenuWrapper from 'components/elements/TabMenu/TabMenuWrapper';
import PropTypes from 'prop-types';
import AssetType from 'types/AssetType';
import TabContentItemWrapper from 'components/elements/TabMenu/TabContentItemWrapper';
import { useTxStatus } from 'contexts/txStatusContext';
import PrivateSendTab from './PrivateSendTab';
import PrivateReceiveTab from './PrivateReceiveTab';
import ToPublicTab from './ToPublicTab';

const TABS = {
  Receive: 'receive',
  Send: 'send',
  ToPublic: 'toPubliic',
};

const PrivateAssetTabs = ({ selectedAssetType }) => {
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
          label="To Public"
          onClick={() => onClickTab(TABS.ToPublic)}
          active={selectedTabIdx === TABS.ToPublic}
          className="rounded-r-lg"
        />
      </TabMenuWrapper>
      <TabContentItemWrapper
        tabIndex={TABS.Send}
        currentTabIndex={selectedTabIdx}
      >
        <PrivateSendTab selectedAssetType={selectedAssetType} />
      </TabContentItemWrapper>
      <TabContentItemWrapper
        tabIndex={TABS.Receive}
        currentTabIndex={selectedTabIdx}
      >
        <PrivateReceiveTab selectedAssetType={selectedAssetType} />
      </TabContentItemWrapper>
      <TabContentItemWrapper
        tabIndex={TABS.ToPublic}
        currentTabIndex={selectedTabIdx}
      >
        <ToPublicTab selectedAssetType={selectedAssetType} />
      </TabContentItemWrapper>
    </>
  );
};

PrivateAssetTabs.propTypes = {
  selectedAssetType: PropTypes.instanceOf(AssetType),
};

export default PrivateAssetTabs;
