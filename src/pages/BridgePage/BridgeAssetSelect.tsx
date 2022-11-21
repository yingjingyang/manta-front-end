// @ts-nocheck
import React from 'react';
import BridgeBalanceInput from 'pages/BridgePage/BridgeBalanceInput';
import AssetTypeSelect from 'components/Assets/AssetTypeSelect';
import { useBridgeTx } from './BridgeContext/BridgeTxContext';
import { useBridgeData } from './BridgeContext/BridgeDataContext';

const BridgeAssetSelect = () => {
  const {
    senderAssetCurrentBalance,
    senderAssetType,
    setSenderAssetTargetBalance,
    maxInput,
    minInput,
    senderAssetTypeOptions,
    setSelectedAssetType,
  } = useBridgeData();
  const {
    txIsOverMinAmount,
    userHasSufficientFunds,
  } = useBridgeTx();

  const balanceText = senderAssetCurrentBalance
    ? senderAssetCurrentBalance.toDisplayString()
    : '--';

  return (
    <div className="w-100 relative">
      <AssetTypeSelect
        assetType={senderAssetType}
        assetTypeOptions={senderAssetTypeOptions}
        setSelectedAssetType={setSelectedAssetType}
      />
      <BridgeBalanceInput
        balanceText={balanceText}
        senderAssetCurrentBalance={senderAssetCurrentBalance}
        setSenderAssetTargetBalance={setSenderAssetTargetBalance}
        senderAssetType={senderAssetType}
        maxSendableBalance={maxInput}
      />
    </div>
  );
};

export default BridgeAssetSelect;
