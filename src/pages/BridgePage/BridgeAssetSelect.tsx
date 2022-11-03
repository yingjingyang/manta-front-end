// @ts-nocheck
import React from 'react';
import BridgeBalanceInput from 'components/AmountInput/BridgeBalanceInput';
import AssetTypeSelect from 'components/Assets/AssetTypeSelect';
import { useBridgeTx } from './BridgeContext/BridgeTxContext';
import { useBridgeData } from './BridgeContext/BridgeDataContext';

const BridgeAssetSelect = () => {
  const {
    senderAssetCurrentBalance,
    senderAssetType,
    setSenderAssetTargetBalance,
    maxInput,
    senderAssetTypeOptions,
    setSelectedAssetType,
  } = useBridgeData();
  const {
    txIsOverMinAmount,
    userHasSufficientFunds,
  } = useBridgeTx();

  const balanceText = senderAssetCurrentBalance
    ? `${senderAssetCurrentBalance.toString()} ${senderAssetType.ticker}`
    : null;

  let errorText = null;
  if (txIsOverMinAmount() === false) {
    errorText = 'Tx amount too low'
  } else if (userHasSufficientFunds() === false) {
    errorText = 'Tx amount is too high'
  }

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
