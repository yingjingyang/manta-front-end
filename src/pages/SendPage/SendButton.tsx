// @ts-nocheck
import React, { useState } from "react";
import classNames from "classnames";
import MantaLoading from "components/Loading";
import { useTxStatus } from "contexts/txStatusContext";
import Balance from "types/Balance";
import { usePrivateWallet } from "contexts/privateWalletContext";
import { useExternalAccount } from "contexts/externalAccountContext";
import { useSend } from "./SendContext";

const SendButton = () => {
  const { send, isToPrivate, isToPublic, isPublicTransfer, isPrivateTransfer } =
    useSend();
  const { txStatus } = useTxStatus();
  const disabled = txStatus?.isProcessing();

  let buttonLabel;
  if (isToPrivate()) {
    buttonLabel = "To Private";
  } else if (isToPublic()) {
    buttonLabel = "To Public";
  } else if (isPublicTransfer()) {
    buttonLabel = "Public Transfer";
  } else if (isPrivateTransfer()) {
    buttonLabel = "Private Transfer";
  }
  const onClickHandler = () => send();

  return (
    <button
      id="sendButton"
      onClick={onClickHandler}
      className={classNames(
        "py-2 cursor-pointer unselectable-text",
        "text-center text-white rounded-lg gradient-button w-full",
        { disabled: disabled }
      )}>
      {buttonLabel}
    </button>
  );
};

const ValidationButton = () => {
  const {
    isPublicTransfer,
    isPrivateTransfer,
    receiverAddress,
    userCanPayFee,
    userHasSufficientFunds,
    receiverAssetType,
    receiverAmountIsOverExistentialBalance,
    senderAssetTargetBalance,
    senderNativeTokenPublicBalance,
  } = useSend();
  const { signerIsConnected } = usePrivateWallet();
  const { externalAccount } = useExternalAccount();

  let validationMsg = null;
  let bgColor = "gradient-button filter brightness-50";
  if (!signerIsConnected && !isPublicTransfer() && !externalAccount) {
    validationMsg = "Connect Wallet and Signer";
    bgColor = "gradient-button";
  } else if (!signerIsConnected && !isPublicTransfer()) {
    validationMsg = "Connect Signer";
    bgColor = "bg-connect-signer-button";
  } else if (!externalAccount) {
    validationMsg = "Connect Wallet";
    bgColor = "bg-connect-wallet-button";
  } else if (!senderAssetTargetBalance) {
    validationMsg = "Enter Amount";
  } else if (userHasSufficientFunds() === false) {
    validationMsg = "Insuffient balance";
  } else if (
    receiverAddress === null &&
    (isPrivateTransfer() || isPublicTransfer())
  ) {
    validationMsg = `Enter Recipient ${
      isPrivateTransfer() ? "zkAddress" : "Substrate address"
    }`;
  } else if (
    receiverAddress === false &&
    (isPrivateTransfer() || isPublicTransfer())
  ) {
    validationMsg = `Invalid ${
      isPrivateTransfer() ? "zkAddress" : "Substrate address"
    }`;
  } else if (receiverAmountIsOverExistentialBalance() === false) {
    const existentialDeposit = new Balance(
      receiverAssetType,
      receiverAssetType.existentialDeposit
    );
    validationMsg = `min > ${existentialDeposit.toDisplayString(12, false)}`;
  } else if (userCanPayFee() === false) {
    validationMsg = `Cannot pay ${senderNativeTokenPublicBalance?.assetType?.baseTicker} fee`;
  }

  return validationMsg ? (
    <div
      className={classNames(
        `py-2 unselectable-text text-center text-white rounded-lg w-full ${bgColor}`
      )}>
      {validationMsg}
    </div>
  ) : (
    <SendButton />
  );
};

const DisplayButton = () => {
  const { txStatus } = useTxStatus();
  const [validationMsg, setValidationMsg] = useState(null);

  if (txStatus?.isProcessing()) {
    return <MantaLoading className="ml-6 py-4 place-self-center" />;
  } else {
    return (
      <ValidationButton
        validationMsg={validationMsg}
        setValidationMsg={setValidationMsg}
      />
    );
  }
};

export default DisplayButton;
