import React, { useState, useEffect, useRef } from 'react';
import Button from 'components/elements/Button';
import MantaLoading from 'components/elements/Loading';
import FormSelect from 'components/elements/Form/FormSelect';
import { showError, showSuccess } from 'utils/ui/Notifications';
import FormInput from 'components/elements/Form/FormInput';
import {
  assetIsInitialized,
  saveInitializedAsset,
} from 'utils/persistence/InitializedAssetStorage';
import CurrencyType from 'types/CurrencyType';
import { makeTxResHandler } from 'utils/api/MakeTxResHandler';
import TxStatus from 'types/TxStatus';
import { useSubstrate } from 'contexts/SubstrateContext';
import BN from 'bn.js';
import { useExternalAccount } from 'contexts/ExternalAccountContext';
import {
  DUMMY_ASSET_BALANCE,
  loadPublicAssetBalance,
  savePublicAssetBalance,
} from 'utils/persistence/DummyPublicAssetStorage';
import SignerInterface from 'manta-signer-interface';
import { BrowserAddressStore } from 'manta-signer-interface';
import config from 'config';

const DepositTab = () => {
  const { api } = useSubstrate();
  const [, setUnsub] = useState(null);
  const [status, setStatus] = useState(null);
  const [depositAmountInput, setDepositAmountInput] = useState(null);
  const [mintAmount, setMintAmount] = useState(null);
  const [publicAssetBalance, setPublicAssetBalance] = useState(null);
  let mintAsset = useRef(null);
  const txResWasHandled = useRef(null);
  let signerInterface = useRef(null);
  const [selectedAssetType, setSelectedAssetType] = useState(null);
  const { currentExternalAccount } = useExternalAccount();

  useEffect(() => {
    selectedAssetType &&
      setPublicAssetBalance(loadPublicAssetBalance(selectedAssetType.assetId));
  }, [selectedAssetType, status]);

  const onDepositSuccess = (block) => {
    // Every tx in the batch gets handled by default, only handle 1
    if (txResWasHandled.current === true) {
      return;
    }
    if (!assetIsInitialized(selectedAssetType.assetId)) {
      saveInitializedAsset(selectedAssetType.assetId);
    }
    savePublicAssetBalance(
      selectedAssetType.assetId,
      publicAssetBalance.sub(mintAmount)
    );
    txResWasHandled.current = true;
    signerInterface.current.cleanupTxSuccess();
    setStatus(TxStatus.finalized(block));
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
    signerInterface.current.cleanupTxFailure();
    setStatus(TxStatus.failed(block, error));
    showError('Deposit failed');
  };

  const onDepositUpdate = (message) => {
    setStatus(TxStatus.processing(message));
  };

  const onClickDeposit = async () => {
    setStatus(TxStatus.processing());

    signerInterface.current = new SignerInterface(
      api,
      new BrowserAddressStore(config.BIP_44_COIN_TYPE_ID)
    );
    const signerIsConnected = await signerInterface.current.signerIsConnected();
    if (!signerIsConnected) {
      showError('Manta Signer must be connected');
      return;
    }
    try {
      const mintTx = await signerInterface.current.buildMintTx(
        selectedAssetType.assetId,
        mintAmount
      );
      const txResHandler = makeTxResHandler(
        api,
        onDepositSuccess,
        onDepositFailure,
        onDepositUpdate
      );
      if (!assetIsInitialized(selectedAssetType.assetId)) {
        const initTx = api.tx.mantaPay.initAsset(
          selectedAssetType.assetId,
          DUMMY_ASSET_BALANCE
        );
        const unsub = api.tx.utility
          .batch([initTx, mintTx])
          .signAndSend(currentExternalAccount, txResHandler);
        setUnsub(() => unsub);
      } else {
        const unsub = mintTx.signAndSend(currentExternalAccount, txResHandler);
        setUnsub(() => unsub);
      }
    } catch (error) {
      onDepositFailure();
    }
  };

  const onChangeDepositAmountInput = (amountStr) => {
    setDepositAmountInput(amountStr);
    try {
      setMintAmount(new BN(amountStr));
    } catch (error) {
      return;
    }
  };

  const onClickMax = () => {
    onChangeDepositAmountInput(publicAssetBalance.toString());
  };
  const insufficientFunds = mintAmount?.gt(publicAssetBalance);
  const formIsDisabled = status && status.isProcessing();
  const buttonIsDisabled =
    formIsDisabled || // transaction in progress
    insufficientFunds || // public funds < attempted deposit
    !mintAmount || // amount in form is blank
    !mintAmount.gt(new BN(0)); // amount in form < 0

  const balanceString =
    selectedAssetType &&
    publicAssetBalance &&
    `Available: ${publicAssetBalance.toString()} ${selectedAssetType.ticker}`;

  return (
    <>
      <FormSelect
        selectedOption={selectedAssetType}
        setSelectedOption={setSelectedAssetType}
        options={CurrencyType.AllCurrencies()}
        disabled={formIsDisabled}
      />
      <div className="pb-6">
        <FormInput
          onClickMax={onClickMax}
          onChange={(e) => onChangeDepositAmountInput(e.target.value)}
          value={depositAmountInput}
          step="1"
        >
          {balanceString}
        </FormInput>
      </div>
      {status?.isProcessing() ? (
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

export default DepositTab;
