import React, { useState, useEffect, useRef } from 'react';
import { PageContent, Navbar } from 'components/elements/Layouts';
import Button from 'components/elements/Button';
import MantaLoading from 'components/elements/Loading';
import TabMenuWrapper from 'components/elements/TabMenu/TabMenuWrapper';
import TabMenu from 'components/elements/TabMenu/TabMenu';
import TabContentItemWrapper from 'components/elements/TabMenu/TabContentItemWrapper';
import FormSelect from 'components/elements/Form/FormSelect';
import { showError, showSuccess } from 'utils/Notifications';
import FormInput from 'components/elements/Form/FormInput';
import {
  assetIsInitialized,
  saveInitializedAsset,
} from 'utils/persistence/InitializedAssetStorage';
import CurrencyType from 'types/ui/CurrencyType';
import { makeTxResHandler } from 'utils/api/MakeTxResHandler';
import TxStatus from 'types/ui/TxStatus';
import { persistSpendableAsset } from 'utils/persistence/AssetStorage';
import { useSubstrate } from 'contexts/SubstrateContext';
import BN from 'bn.js';
import { useSigner } from 'contexts/SignerContext';
import { useExternalAccount } from 'contexts/ExternalAccountContext';
import {
  DUMMY_ASSET_BALANCE,
  loadPublicAssetBalance,
  savePublicAssetBalance,
} from 'utils/persistence/DummyPublicAssetStorage';

const DepositTab = () => {
  const { api } = useSubstrate();
  const [, setUnsub] = useState(null);
  const [status, setStatus] = useState(null);
  const [depositAmountInput, setDepositAmountInput] = useState(null);
  const [mintAmount, setMintAmount] = useState(null);
  const [publicAssetBalance, setPublicAssetBalance] = useState(null);
  let mintAsset = useRef(null);
  const [selectedAssetType, setSelectedAssetType] = useState(null);
  const { signerClient } = useSigner();
  const { currentExternalAccount } = useExternalAccount();

  useEffect(() => {
    selectedAssetType &&
      setPublicAssetBalance(loadPublicAssetBalance(selectedAssetType.assetId));
  }, [selectedAssetType, status]);

  const onDepositSuccess = (block) => {
    if (!assetIsInitialized(selectedAssetType.assetId)) {
      saveInitializedAsset(selectedAssetType.assetId);
    }
    savePublicAssetBalance(
      selectedAssetType.assetId,
      publicAssetBalance.sub(mintAmount)
    );
    persistSpendableAsset(mintAsset.current);
    mintAsset.current = null;
    showSuccess('Deposit successful');
    setStatus(TxStatus.finalized(block));
  };

  const onDepositFailure = (block, error) => {
    mintAsset.current = null;
    showError('Deposit failed');
    setStatus(TxStatus.failed(block, error));
    console.error(error);
  };

  const onDepositUpdate = (message) => {
    setStatus(TxStatus.processing(message));
  };

  const submitTransaction = (payload) => {
    const mintTx = api.tx.mantaPay.mintPrivateAsset(payload);
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
  };

  const onClickDeposit = async () => {
    mintAsset.current = await signerClient.generateAsset(
      selectedAssetType.assetId,
      mintAmount
    );
    const mintInfo = await signerClient.generateMintPayload(mintAsset.current);
    submitTransaction(mintInfo);
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
