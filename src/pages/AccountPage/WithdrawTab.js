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
import {
  loadSpendableBalance,
  removeSpendableAsset,
} from 'utils/persistence/AssetStorage';
import TxStatus from 'types/ui/TxStatus';
import { useSubstrate } from 'contexts/SubstrateContext';
import { makeTxResHandler } from 'utils/api/MakeTxResHandler';
import getLedgerState from 'api/GetLedgerState';
import selectCoins from 'utils/SelectCoins';
import { batchGenerateTransactions } from 'utils/api/BatchGenerateTransactions';

const WithdrawTab = () => {
  const { api } = useSubstrate();
  const [selectedAssetType, setSelectedAssetType] = useState(null);
  const [withdrawAmountInput, setWithdrawAmountInput] = useState('');
  const [reclaimAmount, setReclaimAmount] = useState(new BN(-1));
  const [status, setStatus] = useState(null);
  const txResWasHandled = useRef(null);
  const coinSelection = useRef(null);
  const changeAmount = useRef(null);
  const [, setUnsub] = useState(null);
  const [privateBalance, setPrivateBalance] = useState(null);
  const { signerClient } = useSigner();
  const { currentExternalAccount } = useExternalAccount();

  useEffect(() => {
    selectedAssetType &&
      setPrivateBalance(loadSpendableBalance(selectedAssetType.assetId));
  }, [selectedAssetType, status]);

  const generateReclaimParams = async (reclaimAsset1, reclaimAsset2) => {
    let ledgerState1 = await getLedgerState(reclaimAsset1, api);
    let ledgerState2 = await getLedgerState(reclaimAsset2, api);
    const changeAddress = await signerClient.generateNextInternalAddress(
      selectedAssetType.assetId
    );
    const payload = await signerClient.generateReclaimParams(
      reclaimAsset1,
      reclaimAsset2,
      ledgerState1,
      ledgerState2,
      reclaimAsset1.value.add(reclaimAsset2.value.sub(changeAmount.current)),
      changeAddress
    );
    return payload;
  };

  const onReclaimSuccess = async (block) => {
    // Every tx in the batch gets handled by default, only handle 1
    if (txResWasHandled.current === true) {
      return;
    }
    showSuccess('Withdrawal successful');
    coinSelection.current.forEach((asset) => {
      removeSpendableAsset(asset.current);
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
    [coinSelection.current, changeAmount.current] = selectCoins(
      reclaimAmount,
      selectedAssetType.assetId
    );
    const transactions = await batchGenerateTransactions(
      coinSelection.current,
      generateReclaimParams,
      signerClient.requestGenerateReclaimPayloads.bind(
        signerClient,
        selectedAssetType.assetId
      ),
      api.tx.mantaPay.reclaim.bind(api),
      signerClient,
      api
    );
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
