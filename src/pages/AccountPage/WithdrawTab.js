import React, { useState, useRef, useEffect } from 'react';
import Button from 'components/elements/Button';
import MantaLoading from 'components/elements/Loading';
import FormSelect from 'components/elements/Form/FormSelect';
import { showSuccess, showError } from 'utils/ui/Notifications';
import FormInput from 'components/elements/Form/FormInput';
import CurrencyType from 'types/ui/CurrencyType';
import { useSigner } from 'contexts/SignerContext';
import { useExternalAccount } from 'contexts/ExternalAccountContext';
import BN from 'bn.js';
import { useWallet } from 'contexts/WalletContext';
import TxStatus from 'types/ui/TxStatus';
import { useSubstrate } from 'contexts/SubstrateContext';
import { makeTxResHandler } from 'utils/api/MakeTxResHandler';
import {
  generateMintZeroCoinTx,
  generateInternalTransferParams,
  generateReclaimParams,
} from 'utils/api/BatchGenerateTransactions';
import selectCoins from 'utils/SelectCoins';

const WithdrawTab = () => {
  const { api } = useSubstrate();
  const { getSpendableBalance, removeSpendableAsset, spendableAssets } =
    useWallet();
  const { signerClient } = useSigner();
  const { currentExternalAccount } = useExternalAccount();

  const [selectedAssetType, setSelectedAssetType] = useState(null);
  const [withdrawAmountInput, setWithdrawAmountInput] = useState('');
  const [reclaimAmount, setReclaimAmount] = useState(new BN(-1));
  const [status, setStatus] = useState(null);
  const txResWasHandled = useRef(null);
  const coinSelection = useRef(null);
  const [, setUnsub] = useState(null);
  const [privateBalance, setPrivateBalance] = useState(null);

  useEffect(() => {
    selectedAssetType &&
      setPrivateBalance(getSpendableBalance(selectedAssetType.assetId));
  }, [selectedAssetType, status, spendableAssets]);

  const onReclaimSuccess = async (block) => {
    // Every tx in the batch gets handled by default, only handle 1
    if (txResWasHandled.current === true) {
      return;
    }
    showSuccess('Withdrawal successful');
    coinSelection.current.coins.forEach((asset) => {
      removeSpendableAsset(asset);
    });
    coinSelection.current = null;
    txResWasHandled.current = true;
    setStatus(TxStatus.finalized(block));
  };

  const onReclaimFailure = async (block, error) => {
    // Every tx in the batch gets handled by default, only handle 1
    console.error(error);
    if (txResWasHandled.current === true) {
      return;
    }
    showError('Withdrawal failed');
    txResWasHandled.current = true;
    setStatus(TxStatus.failed(block, error));
  };

  const onReclaimUpdate = (message) => {
    setStatus(TxStatus.processing(message));
  };

  const onClickWithdraw = async () => {
    setStatus(TxStatus.processing());
    coinSelection.current = selectCoins(reclaimAmount, spendableAssets);

    let transactions = [];

    if (coinSelection.length === 1) {
      const [mintZeroCoinAsset, mintZeroCoinTx] = await generateMintZeroCoinTx(
        coinSelection.current.coins[0].asset_id,
        signerClient,
        api
      );
      transactions.push(mintZeroCoinTx);
      coinSelection.current.coins.push(mintZeroCoinAsset);
    }

    const [privateTransferParamsList, intermediateAssets] =
      await generateInternalTransferParams(
        coinSelection.current,
        signerClient,
        api
      );

    const secondLastAsset =
      coinSelection.current.coins[coinSelection.current.coins.length - 2];
    const accumulatorAsset =
      intermediateAssets[intermediateAssets.length - 1] || secondLastAsset;
    const lastAsset =
      coinSelection.current.coins[coinSelection.current.coins.length - 1];
    const reclaimParams = await generateReclaimParams(
      accumulatorAsset,
      lastAsset,
      intermediateAssets,
      coinSelection.current.targetAmount,
      signerClient,
      api
    );

    const payloads = await signerClient.requestGenerateReclaimPayloads(
      reclaimParams,
      privateTransferParamsList
    );

    payloads.private_transfer_data_list
      .map((payload) => api.tx.mantaPay.privateTransfer(payload))
      .forEach((privateTransferTransaction) =>
        transactions.push(privateTransferTransaction)
      );
    const reclaimTx = api.tx.mantaPay.reclaim(payloads.reclaim_data);
    transactions.push(reclaimTx);

    const txResHandler = makeTxResHandler(
      api,
      onReclaimSuccess,
      onReclaimFailure,
      onReclaimUpdate
    );

    const unsub = api.tx.utility
      .batch(transactions)
      .signAndSend(currentExternalAccount, txResHandler);
    setUnsub(() => unsub);
  };

  const onChangeWithdrawAmountInput = (amountStr) => {
    setWithdrawAmountInput(amountStr);
    try {
      setReclaimAmount(new BN(amountStr));
    } catch (error) {
      return;
    }
  };

  const onClickMax = () => {
    onChangeWithdrawAmountInput(privateBalance.toString());
  };

  const insufficientFunds = privateBalance?.lt(reclaimAmount);
  const formIsDisabled = status?.isProcessing();
  const buttonIsDisabled =
    formIsDisabled || insufficientFunds || !reclaimAmount.gt(new BN(0));

  const balanceString =
    privateBalance &&
    selectedAssetType &&
    `Available: ${privateBalance.toString()} private ${
      selectedAssetType.ticker
    }`;

  return (
    <>
      <FormSelect
        label="Token"
        selectedOption={selectedAssetType}
        setSelectedOption={setSelectedAssetType}
        options={CurrencyType.AllCurrencies()}
        disabled={formIsDisabled}
      />
      <div className="pb-6">
        <FormInput
          step="0.01"
          value={withdrawAmountInput}
          onChange={(e) => onChangeWithdrawAmountInput(e.target.value)}
          onClickMax={onClickMax}
        >
          {balanceString}
        </FormInput>
      </div>
      {status?.isProcessing() ? (
        <MantaLoading className="py-4" />
      ) : (
        <Button
          onClick={onClickWithdraw}
          disabled={buttonIsDisabled}
          className="btn-primary btn-hover hover:animate-pulse w-full text-lg py-3"
        >
          Withdraw
        </Button>
      )}
    </>
  );
};

export default WithdrawTab;
