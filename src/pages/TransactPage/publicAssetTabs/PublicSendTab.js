import React, { useState, useEffect, useCallback } from 'react';
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
import getBalanceString from 'utils/ui/getBalanceString';
import Balance from 'types/Balance';
import Decimal from 'decimal.js';
import {
  getIsInsuficientFunds,
  getTransferButtonIsDisabled
} from 'utils/ui/formValidation';
import { useSelectedAssetType } from 'contexts/selectedAssetTypeContext';
import { useNativeTokenWallet } from 'contexts/nativeTokenWalletContext';

const PublicSendTab = () => {
  const { api } = useSubstrate();
  const { externalAccount, externalAccountSigner } = useExternalAccount();
  const { txStatus, setTxStatus } = useTxStatus();
  const { selectedAssetType } = useSelectedAssetType();
  const { getUserCanPayFee } = useNativeTokenWallet();

  const [publicBalance, setPublicBalance] = useState(null);
  const [publicTransferAmount, setPublicTransferAmount] = useState(null);
  const [sendAmountInput, setSendAmountInput] = useState(null);
  const [receivingAddress, setReceivingAddress] = useState(null);
  const [addressInfoText, setAddressInfoText] = useState('Receiver');

  const refreshPublicBalance = async () => {
    const balanceAmount = await api.query.mantaPay.balances(
      externalAccount.address,
      selectedAssetType.assetId
    );
    setPublicBalance(new Balance(selectedAssetType, balanceAmount));
  };

  useEffect(() => {
    const refreshPublicBalanceOnChange = async () => {
      if (selectedAssetType && externalAccount && api) {
        await api.isReady;
        refreshPublicBalance();
      }
    };
    refreshPublicBalanceOnChange();
  }, [selectedAssetType, externalAccount, api]);

  const onPublicTransferSuccess = async (block) => {
    showSuccess('Transfer successful');
    setTxStatus(TxStatus.finalized(block));
    refreshPublicBalance();
  };

  const onPublicTransferFailure = (block, error) => {
    console.error(error);
    setTxStatus(TxStatus.failed(block, error));
    showError('Transfer failed');
    refreshPublicBalance();
  };

  const onPublicTransferUpdate = (message) => {
    setTxStatus(TxStatus.processing(message));
  };

  const handleUserCannotPayFee = () => {
    setTxStatus(TxStatus.failed());
    showError('Transfer failed: cannot pay fee');
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
      const tx = api.tx.mantaPay.transferAsset(
        receivingAddress,
        selectedAssetType.assetId,
        publicTransferAmount.valueAtomicUnits
      );
      const userCanPayFee = await getUserCanPayFee(tx);
      if (!userCanPayFee) {
        handleUserCannotPayFee();
        return;
      }
      tx.signAndSend(externalAccountSigner, txResHandler);
    } catch (error) {
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
    if (publicBalance) onChangeSendAmountInput(publicBalance.toString(false));
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

PublicSendTab.propTypes = {
  selectedAssetType: PropTypes.instanceOf(AssetType)
};

export default PublicSendTab;
