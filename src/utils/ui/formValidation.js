

export function getToPublicButtonIsDisabled(
  reclaimAmount,
  presentBalance,
  txStatus
) {
  return (
    !presentBalance ||
    !reclaimAmount ||
    reclaimAmount.assetType.assetId !== presentBalance.assetType.assetId ||
    getIsInsuficientFunds(reclaimAmount, presentBalance) ||
    txStatus?.isProcessing()
  );
}

export function getToPrivateButtonIsDisabled(
  mintAmount,
  presentBalance,
  txStatus
) {
  return (
    !presentBalance ||
    !mintAmount ||
    mintAmount.assetType.assetId !== presentBalance.assetType.assetId ||
    getIsInsuficientFunds(mintAmount, presentBalance) ||
    txStatus?.isProcessing()
  );
}

export function getTransferButtonIsDisabled(
  transferAmount,
  presentBalance,
  receivingAddress,
  txStatus
) {
  return (
    !presentBalance ||
    !transferAmount ||
    !receivingAddress ||
    transferAmount.assetType.assetId !== presentBalance.assetType.assetId ||
    getIsInsuficientFunds(transferAmount, presentBalance) ||
    txStatus?.isProcessing()
  );
}

function getIsInsuficientFunds(targetBalance, presentBalance) {
  return targetBalance.gt(presentBalance);
}
