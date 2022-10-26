// @ts-nocheck
import React from 'react';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import SendAmountInput from 'components/AmountInput/SendAmountInput';
import AssetTypeSelect from 'components/Assets/AssetTypeSelect';
import { useSend } from '../SendContext';

const SendAssetSelect = () => {
  const { isInitialSync } = usePrivateWallet();
  const {
    isPrivateTransfer,
    isToPublic,
    senderAssetCurrentBalance,
    senderAssetType,
    setSenderAssetTargetBalance,
    getMaxSendableBalance,
    senderAssetTypeOptions,
    setSelectedAssetType
  } = useSend();

  const maxSendableBalance = getMaxSendableBalance();

  const balanceText =
    isInitialSync && (isPrivateTransfer() || isToPublic())
      ? 'Syncing to ledger'
      : senderAssetCurrentBalance
        ? `${senderAssetCurrentBalance.toString()} ${senderAssetType.ticker}`
        : '';

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
        maxSendableBalance={maxSendableBalance}
      />
    </div>
  );
};

export default SendAssetSelect;
