// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import MantaLoading from 'components/Loading';
import { useTxStatus } from 'contexts/txStatusContext';
import { showError } from 'utils/ui/Notifications';
import Balance from 'types/Balance';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import { useExternalAccount } from 'contexts/externalAccountContext';
import { useSend } from './SendContext';

const SendButton = () => {
  const {
    isToPrivate,
    isToPublic,
    isPublicTransfer,
    isPrivateTransfer,
    userCanPayFee,
    userHasSufficientFunds,
    receiverAssetType,
    receiverAmountIsOverExistentialBalance
  } = useSend();
  const { signerIsConnected } = usePrivateWallet();
  const { externalAccount } = useExternalAccount();
  const { txStatus } = useTxStatus();
  const { send, senderInputValue } = useSend();
  const disabled = txStatus?.isProcessing();

  const DisplayButton = () => {
    if (!signerIsConnected) {
      return (
        <div className="py-2 unselectable-text text-center text-white gradient-button rounded-lg w-full">
          Connect Signer
        </div>
      ); 
    } else if (!externalAccount) {
      return (
        <div className="py-2 unselectable-text text-center text-white gradient-button rounded-lg w-full">
          Connect Wallet
        </div>
      ); 
    } else if (!senderInputValue) {
      // amount not entered
      return (
        <div className="py-2 filter brightness-50 unselectable-text text-center text-white gradient-button rounded-lg w-full">
          Enter Amount
        </div>
      );
    } else if (userHasSufficientFunds() === false) {
      // insufficient balance
      return (
        <div className="py-2 unselectable-text text-center text-white gradient-button rounded-lg w-full">
          Insuffient balance
        </div>
      );
    } else if (txStatus?.isProcessing()) {
      // pending transaction
      return <MantaLoading className="py-4" />;
    } else {
      // transact button
      return (
        <button
          id="sendButton"
          onClick={onClick}
          className={classNames(
            'py-2 cursor-pointer unselectable-text',
            'text-center text-white rounded-lg gradient-button w-full',
            { disabled: disabled }
          )}
        >
          {buttonLabel}
        </button>
      );
    }
  }

  const onClick = () => {
    if (!signerIsConnected) {
      showError('Signer must be connected');
    } else if (receiverAmountIsOverExistentialBalance() === false) {
      const existentialDeposit = new Balance(
        receiverAssetType,
        receiverAssetType.existentialDeposit
      );
      showError(
        `Minimum ${
          receiverAssetType.ticker
        } transaction is ${existentialDeposit.toDisplayString()}`
      );
    } else if (userCanPayFee() === false) {
      showError('Cannot pay transaction fee; deposit DOL to transact');
    } else if (!disabled) {
      send();
    }
  };

  let buttonLabel;
  if (isToPrivate()) {
    buttonLabel = 'To Private';
  } else if (isToPublic()) {
    buttonLabel = 'To Public';
  } else if (isPublicTransfer()) {
    buttonLabel = 'Public Transfer';
  } else if (isPrivateTransfer()) {
    buttonLabel = 'Private Transfer';
  }

  return (<DisplayButton/>)
};

export default SendButton;
