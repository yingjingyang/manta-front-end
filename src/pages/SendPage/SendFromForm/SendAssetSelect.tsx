// @ts-nocheck
import React from 'react';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import SendAmountInput from 'components/AmountInput/SendAmountInput';
import SendAssetTypeDropdown from 'components/AssetTypeDropdown/SendAssetTypeDropdown';
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

  const balanceText =
  isInitialSync && (isPrivateTransfer() || isToPublic())
    ? 'Syncing to ledger'
    : senderAssetCurrentBalance
      ? `${senderAssetCurrentBalance.toString()} ${senderAssetType.ticker}`
      : '';

  return (
    <div className="w-100 relative">
      <SendAssetTypeDropdown
        senderAssetType={senderAssetType}
        senderAssetTypeOptions={senderAssetTypeOptions} 
        setSelectedAssetType={setSelectedAssetType}
      />
      <SendAmountInput 
        balanceText={balanceText}
        senderAssetCurrentBalance={senderAssetCurrentBalance}
        setSenderAssetTargetBalance={setSenderAssetTargetBalance}
        senderAssetType={senderAssetType}
        getMaxSendableBalance={getMaxSendableBalance}
      />
    </div>
  );
};

export default SendAssetSelect;
