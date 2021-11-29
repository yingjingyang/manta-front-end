export function getIsInsuficientFunds(targetBalance, presentBalance) {
  if (presentBalance === null) {
    return false;
  } else if (targetBalance === null) {
    return false;
  } else {
    return targetBalance.gt(presentBalance);
  }
}

export function getToPublicButtonIsDisabled(
  reclaimAmount,
  insufficientFunds,
  txStatus
) {
  return !reclaimAmount || insufficientFunds || txStatus?.isProcessing();
}

export function getToPrivateButtonIsDisabled(
  mintAmount,
  insufficientFunds,
  txStatus
) {
  return !mintAmount || insufficientFunds || txStatus?.isProcessing();
}

export function getTransferButtonIsDisabled(
  transferAmount,
  receivingAddress,
  insufficientFunds,
  txStatus
) {
  return (
    !transferAmount ||
    !receivingAddress ||
    insufficientFunds ||
    txStatus?.isProcessing()
  );
}
