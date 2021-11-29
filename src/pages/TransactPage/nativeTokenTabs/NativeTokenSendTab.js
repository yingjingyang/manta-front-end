import React, { useState, useEffect, useCallback } from 'react';
import BN from 'bn.js';
import FormInput from 'components/elements/Form/FormInput';
import Button from 'components/elements/Button';
import { useSubstrate } from 'contexts/substrateContext';
import Svgs from 'resources/icons';
import { useExternalAccount } from 'contexts/externalAccountContext';
import TxStatus from 'types/TxStatus';
import { makeTxResHandler } from 'utils/api/MakeTxResHandler';
import MantaLoading from 'components/elements/Loading';
import { showError, showSuccess } from 'utils/ui/Notifications';
import { useTxStatus } from 'contexts/txStatusContext';
import PropTypes from 'prop-types';
import AssetType from 'types/AssetType';
import Balance from 'types/Balance';
import getBalanceString from 'utils/ui/getBalanceString';
import {
  getIsInsuficientFunds,
  getTransferButtonIsDisabled,
} from 'utils/ui/formValidation';
import Decimal from 'decimal.js';

const NativeTokenSendTab = ({ selectedAssetType }) => {
  const { api } = useSubstrate();
  const { externalAccount, externalAccountSigner } = useExternalAccount();
  const { txStatus, setTxStatus } = useTxStatus();

  const [publicBalance, setPublicBalance] = useState(null);
  const [publicTransferAmount, setPublicTransferAmount] = useState(null);
  const [sendAmountInput, setSendAmountInput] = useState(null);
  const [receivingAddress, setReceivingAddress] = useState('');
  const [addressInfoText, setAddressInfoText] = useState('Receiver');

  const refreshPublicBalance = async () => {
    const balanceAmount = await api.query.system.account(
      externalAccount.address
    );
    setPublicBalance(
      new Balance(selectedAssetType, new BN(balanceAmount.data.free.toString()))
    );
  };

  useEffect(() => {
    const refreshPublicBalanceOnLoad = async () => {
      if (selectedAssetType && externalAccount && api) {
        await api.isReady;
        refreshPublicBalance();
      }
    };
    refreshPublicBalanceOnLoad();
  }, [externalAccount, api, selectedAssetType]);

  const onPublicTransferSuccess = async (block) => {
    refreshPublicBalance();
    showSuccess('Transfer successful');
    setTxStatus(TxStatus.finalized(block));
  };

  const onPublicTransferFailure = (block, error) => {
    refreshPublicBalance();
    setTxStatus(TxStatus.failed(block, error));
    showError('Transfer failed');
  };

  const onPublicTransferUpdate = (message) => {
    setTxStatus(TxStatus.processing(message));
  };

  const onClickSend = async () => {
    setTxStatus(TxStatus.processing());

    const txResHandler = makeTxResHandler(
      api,
      onPublicTransferSuccess,
      onPublicTransferFailure,
      onPublicTransferUpdate
    );

    try {
      api.tx.balances
        .transfer(receivingAddress, publicTransferAmount.valueAtomicUnits)
        .signAndSend(externalAccountSigner, txResHandler);
    } catch (error) {
      console.error(error);
      onPublicTransferFailure();
    }
  };

  const insufficientFunds = getIsInsuficientFunds(
    publicTransferAmount,
    publicBalance
  );
  const buttonIsDisabled = getTransferButtonIsDisabled(
    publicTransferAmount,
    receivingAddress,
    insufficientFunds,
    txStatus
  );

  const onChangeSendAmountInput = (amountStr) => {
    setSendAmountInput(amountStr);
    try {
      setPublicTransferAmount(
        Balance.fromBaseUnits(selectedAssetType, new Decimal(amountStr))
      );
    } catch (error) {
      setPublicTransferAmount(null);
    }
  };

  const onClickMax = useCallback(() => {
    publicBalance && onChangeSendAmountInput(publicBalance.toString(false));
  });

  const onChangeReceivingAddress = (address) => {
    if (!address.length) {
      setReceivingAddress(null);
      setAddressInfoText('Receiver');
      return;
    }
    try {
      api.createType('AccountId', address);
      setReceivingAddress(address);
      setAddressInfoText('Receiver');
    } catch (e) {
      setReceivingAddress(null);
      setAddressInfoText('Invalid address');
    }
  };

  return (
    <div className="send-content">
      <div className="py-2">
        <FormInput
          value={sendAmountInput}
          onChange={(e) => onChangeSendAmountInput(e.target.value)}
          onClickMax={onClickMax}
          type="number"
        >
          {getBalanceString(publicBalance)}
        </FormInput>
      </div>
      <img className="mx-auto" src={Svgs.ArrowDownIcon} alt="switch-icon" />
      <div className="py-2">
        <FormInput
          onChange={(e) => onChangeReceivingAddress(e.target.value)}
          prefixIcon={Svgs.WalletIcon}
          isMax={false}
          type="text"
        >
          {addressInfoText}
        </FormInput>
      </div>
      {txStatus?.isProcessing() ? (
        <MantaLoading className="py-4" />
      ) : (
        <Button
          onClick={onClickSend}
          disabled={buttonIsDisabled}
          className="btn-primary btn-hover w-full text-lg py-3"
        >
          Send
        </Button>
      )}
    </div>
  );
};

NativeTokenSendTab.propTypes = {
  selectedAssetType: PropTypes.instanceOf(AssetType),
};

export default NativeTokenSendTab;
