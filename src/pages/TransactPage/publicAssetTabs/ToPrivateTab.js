import React, { useState, useEffect, useRef, useCallback } from 'react';
import Button from 'components/elements/Button';
import MantaLoading from 'components/elements/Loading';
import { showError, showSuccess } from 'utils/ui/Notifications';
import FormInput from 'components/elements/Form/FormInput';
import { makeTxResHandler } from 'utils/api/MakeTxResHandler';
import TxStatus from 'types/TxStatus';
import { useSubstrate } from 'contexts/substrateContext';
import Decimal from 'decimal.js';
import { useExternalAccount } from 'contexts/externalAccountContext';
import { SignerInterface, BrowserAddressStore } from 'signer-interface';
import config from 'config';
import AssetType from 'types/AssetType';
import { useTxStatus } from 'contexts/txStatusContext';
import getBalanceString from 'utils/ui/getBalanceString';
import Balance from 'types/Balance';
import {
  getIsInsuficientFunds,
  getToPrivateButtonIsDisabled
} from 'utils/ui/formValidation';

const ToPrivateTab = ({ selectedAssetType }) => {
  const { api } = useSubstrate();
  const { externalAccount, externalAccountSigner } = useExternalAccount();
  const { txStatus, setTxStatus } = useTxStatus();

  const [depositAmountInput, setDepositAmountInput] = useState(null);
  const [mintAmount, setMintAmount] = useState(null);
  const [publicBalance, setPublicBalance] = useState(null);
  let mintAsset = useRef(null);
  const txResWasHandled = useRef(null);
  let signerInterface = useRef(null);

  const refreshPublicBalance = async () => {
    try {
      const balanceAmount = await api.query.mantaPay.balances(
        externalAccount.address,
        selectedAssetType.assetId
      );
      setPublicBalance(new Balance(selectedAssetType, balanceAmount));
    } catch (err) {
      console.error(err);
    }
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

  const onDepositSuccess = (block) => {
    // Every tx in the batch gets handled by default, only handle 1
    if (txResWasHandled.current === true) {
      return;
    }
    refreshPublicBalance();
    txResWasHandled.current = true;
    signerInterface.current.cleanupTxSuccess();
    setTxStatus(TxStatus.finalized(block));
    showSuccess('Deposit successful');
  };

  const onDepositFailure = (block, error) => {
    // Every tx in the batch gets handled by default, only handle 1
    if (txResWasHandled.current === true) {
      return;
    }
    console.error(error);
    mintAsset.current = null;
    txResWasHandled.current = true;
    refreshPublicBalance();
    signerInterface.current.cleanupTxFailure();
    setTxStatus(TxStatus.failed(block, error));
    showError('Deposit failed');
  };

  const onDepositUpdate = (message) => {
    setTxStatus(TxStatus.processing(message));
  };

  const onClickDeposit = async () => {
    signerInterface.current = new SignerInterface(
      api,
      new BrowserAddressStore(config.BIP_44_COIN_TYPE_ID)
    );

    const signerIsConnected = await signerInterface.current.signerIsConnected();
    if (!signerIsConnected) {
      showError('Open Manta Signer desktop app and sign in to continue');
      return;
    }

    setTxStatus(TxStatus.processing());

    try {
      const mintTx = await signerInterface.current.buildMintTx(
        selectedAssetType.assetId,
        mintAmount.valueAtomicUnits
      );
      const txResHandler = makeTxResHandler(
        api,
        onDepositSuccess,
        onDepositFailure,
        onDepositUpdate
      );
      mintTx.signAndSend(externalAccountSigner, txResHandler);
    } catch (error) {
      onDepositFailure(null, error);
    }
  };

  const onChangeDepositAmountInput = (amountStr) => {
    setDepositAmountInput(amountStr);
    try {
      setMintAmount(
        Balance.fromBaseUnits(selectedAssetType, Decimal(amountStr))
      );
    } catch (error) {
      setMintAmount(null);
    }
  };

  const onClickMax = useCallback(() => {
    if (publicBalance)
      onChangeDepositAmountInput(publicBalance.toString(false));
  });
  const insufficientFunds = getIsInsuficientFunds(mintAmount, publicBalance);
  const buttonIsDisabled = getToPrivateButtonIsDisabled(
    mintAmount,
    insufficientFunds,
    txStatus
  );

  return (
    <>
      <div className="pb-6">
        <FormInput
          type="number"
          onClickMax={() => onClickMax()}
          onChange={(e) => onChangeDepositAmountInput(e.target.value)}
          value={depositAmountInput}
          step="1"
        >
          {getBalanceString(publicBalance)}
        </FormInput>
      </div>
      {txStatus?.isProcessing() ? (
        <MantaLoading className="py-4" />
      ) : (
        <Button
          onClick={onClickDeposit}
          disabled={buttonIsDisabled}
          className="btn-primary btn-hover w-full text-lg py-3"
        >
          Deposit
        </Button>
      )}
    </>
  );
};

ToPrivateTab.propTypes = {
  selectedAssetType: AssetType
};

export default ToPrivateTab;
