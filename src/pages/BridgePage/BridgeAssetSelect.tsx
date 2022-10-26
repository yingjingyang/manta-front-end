// @ts-nocheck
import React from 'react';
import SendAmountInput from 'components/AmountInput/SendAmountInput';
import AssetTypeSelect from 'components/Assets/AssetTypeSelect';
import { useBridge } from './BridgeContext';

const BridgeAssetSelect = () => {
  const {
    senderAssetCurrentBalance,
    senderAssetType,
    setSenderAssetTargetBalance,
    maxInput,
    senderAssetTypeOptions,
    setSelectedAssetType,
    txIsOverMinAmount,
    userHasSufficientFunds,
  } = useBridge();

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
      <SendAmountInput
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