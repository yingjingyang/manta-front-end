import React, { useState, useRef, useCallback, useEffect } from 'react';
import Button from 'components/elements/Button';
import MantaLoading from 'components/elements/Loading';
import FormSelect from 'components/elements/Form/FormSelect';
import { showSuccess, showError } from 'utils/notifications.util';
import FormInput from 'components/elements/Form/FormInput';
import CurrencyType from 'types/ui/CurrencyType';
import { useSigner } from 'contexts/SignerContext';
import { useExternalAccount } from 'contexts/ExternalAccountContext';
import BN from 'bn.js';
import {
  loadSpendableAssetsById,
  loadSpendableBalance,
  removeSpendableAsset,
} from 'utils/persistence/AssetStorage';
import TxStatus from 'types/ui/TxStatus';
import { useSubstrate } from 'contexts/SubstrateContext';
import { makeTxResHandler } from 'utils/api/MakeTxResHandler';

const WithdrawTab = () => {
  const { api } = useSubstrate();
  const [selectedAssetType, setSelectedAssetType] = useState(null);
  const [withdrawAmountInput, setWithdrawAmountInput] = useState('');
  const [reclaimAmount, setReclaimAmount] = useState(new BN(-1));
  const [status, setStatus] = useState(null);
  const txResWasHandled = useRef(null);
  const coinSelection = useRef(null);
  const mintBatchIsRequired = useRef(null);
  const changeAmount = useRef(null);
  const mintZeroCoinAsset = useRef(null);
  const [unsub, setUnsub] = useState(null);
  const [privateBalance, setPrivateBalance] = useState(null);

  const { signerClient } = useSigner();
  const { currentExternalAccount } = useExternalAccount();

  useEffect(() => {
    selectedAssetType &&
      setPrivateBalance(loadSpendableBalance(selectedAssetType.assetId));
  }, [selectedAssetType, status]);

  const selectCoins = useCallback(() => {
    let totalAmount = new BN(0);
    coinSelection.current = [];
    const spendableAssets = loadSpendableAssetsById(selectedAssetType.assetId);
    spendableAssets.forEach((asset) => {
      if (totalAmount.lt(reclaimAmount) || coinSelection.current.length % 2) {
        totalAmount = totalAmount.add(asset.value);
        coinSelection.current.push(asset);
      }
    });
    // If odd number of coins selected, we will have to mint a zero value coin
    mintBatchIsRequired.current = coinSelection.current.length % 2 === 1;
    changeAmount.current = totalAmount.sub(reclaimAmount);
  }, [selectedAssetType, reclaimAmount]);

  const getLedgerState = async (asset) => {
    const shardIndex = asset.utxo[0];
    const shards = await api.query.mantaPay.coinShards();
    let ledgerState = shards.shard[shardIndex].list;
    // If zero asset, it won't be on chain yet
    if (asset.value.eq(new BN(0))) {
      ledgerState.push(asset.utxo);
    }
    return ledgerState;
  };

  const generateReclaimParams = async (reclaimAsset1, reclaimAsset2) => {
    let ledgerState1 = await getLedgerState(reclaimAsset1);
    let ledgerState2 = await getLedgerState(reclaimAsset2);
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

  const generateMintZeroCoinPayload = async () => {
    mintZeroCoinAsset.current = await signerClient.generateAsset(
      selectedAssetType.assetId,
      new BN(0)
    );
    const payload = await signerClient.generateMintPayload(
      mintZeroCoinAsset.current
    );
    return payload;
  };

  /**
   *
   * polkadot.js API response Handlers
   *
   */

  const onReclaimSuccess = async (block) => {
    // Seems like every batched tx gets handled?
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
    // Seems like every batched tx gets handled?
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
    selectCoins();
    const txResHandler = makeTxResHandler(
      api,
      onReclaimSuccess,
      onReclaimFailure,
      onReclaimUpdate
    );

    let transactions = [];
    if (coinSelection.current.length % 2 === 1) {
      const mintZeroCoinPayload = await generateMintZeroCoinPayload();
      const mintZeroCoinTx =
        api.tx.mantaPay.mintPrivateAsset(mintZeroCoinPayload);
      transactions.push(mintZeroCoinTx);
      coinSelection.current.push(mintZeroCoinAsset.current);
    }
    const reclaimParamsList = [];
    for (let i = 0; i < coinSelection.current.length; i += 2) {
      const reclaimAsset1 = coinSelection.current[i];
      const reclaimAsset2 = coinSelection.current[i + 1];
      const reclaimPayload = await generateReclaimParams(
        reclaimAsset1,
        reclaimAsset2
      );
      reclaimParamsList.push(reclaimPayload);
    }
    const reclaimPayloads = await signerClient.requestGenerateReclaimPayloads(
      reclaimParamsList
    );
    reclaimPayloads.forEach((payload) => {
      transactions.push(api.tx.mantaPay.reclaim(payload));
    });
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
