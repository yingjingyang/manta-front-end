import FormSelect from 'components/elements/Form/FormSelect';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import CurrencyType from 'types/ui/CurrencyType';
import BN from 'bn.js';
import FormInput from 'components/elements/Form/FormInput';
import Button from 'components/elements/Button';
import { useSubstrate } from 'contexts/SubstrateContext';
import Svgs from 'resources/Svgs';
import {
  loadSpendableAssetsById,
  loadSpendableBalance,
  removeSpendableAsset,
} from 'utils/persistence/AssetStorage';
import { useSigner } from 'contexts/SignerContext';
import { useExternalAccount } from 'contexts/ExternalAccountContext';
import TxStatus from 'types/ui/TxStatus';
import { makeTxResHandler } from 'utils/api/MakeTxResHandler';
import MantaAssetShieldedAddress from 'types/MantaAssetShieldedAddress';
import { base64Decode } from '@polkadot/util-crypto';
import MantaLoading from 'components/elements/Loading';
import { showError, showSuccess } from 'utils/notifications.util';

const SendTab = () => {
  // now

  // Replace BN with decimal
  // hande insufficient funds
  // get default to populate in dropdown
  // show available balances

  // todo: extract coin selection logic
  // todo: recovering spent assets?
  // todo: error handling on signer client
  // todo: money types
  // todo: forbid insecure random
  // todo: fix memory leak / pages shouldn't reset on switching labs page
  // todo: standardize components
  // todo: make receiving address copy-pastable
  // todo: handle gap limit
  // todo: shielded address should be base58

  // later
  // todo: reduce duplication in reclaim and private transfer
  // todo: error types
  // todo: ledger state dto?
  // todo: store pending spends?
  // todo: intelligent coin selection?

  const { api } = useSubstrate();
  const [, setUnsub] = useState(null);
  const [selectedAssetType, setSelectedAssetType] = useState(null);
  const [sendAmountInput, setSendAmountInput] = useState(null);
  const [privateTransferAmount, setPrivateTransferAmount] = useState(
    new BN(-1)
  );
  const [receiverAddress, setReceiverAddress] = useState('');
  const coinSelection = useRef(null);
  const mintZeroCoinAsset = useRef(null);
  const mintBatchIsRequired = useRef(null);
  const changeAsset = useRef(null);
  const changeAmount = useRef(null);
  const [status, setStatus] = useState(null);
  const txResWasHandled = useRef(null);
  const [privateBalance, setPrivateBalance] = useState(null);

  const signerClient = useSigner();
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
      if (
        totalAmount.lt(privateTransferAmount) ||
        coinSelection.current.length % 2
      ) {
        totalAmount = totalAmount.add(asset.value);
        coinSelection.current.push(asset);
      }
    });
    // If odd number of coins selected, we will have to mint a zero value coin
    mintBatchIsRequired.current = coinSelection.current.length % 2 === 1;
    changeAmount.current = totalAmount.sub(privateTransferAmount);
  }, [selectedAssetType, privateTransferAmount]);

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

  const generatePrivateTransferPayload = async (inputAsset1, inputAsset2) => {
    let ledgerState1 = await getLedgerState(inputAsset1);
    let ledgerState2 = await getLedgerState(inputAsset2);
    changeAsset.current = await signerClient.generateAsset(
      inputAsset1.assetId,
      changeAmount.current
    );
    const payload = await signerClient.generatePrivateTransferPayload(
      inputAsset1,
      inputAsset2,
      ledgerState1,
      ledgerState2,
      receiverAddress.serialize(),
      inputAsset1.value.add(inputAsset2.value.sub(changeAmount.current)),
      changeAmount.current
    );
    return payload;
  };

  /**
   *
   * polkadot.js API API response Handlers
   *
   */

  const onWithdrawSuccess = async (block) => {
    // Seems like every batched tx gets handled?
    if (txResWasHandled.current === true) {
      return;
    }
    coinSelection.current.forEach((asset) => {
      removeSpendableAsset(asset.current);
    });
    showSuccess('Transfer successful');
    txResWasHandled.current = true;
    setStatus(TxStatus.finalized(block));
  };

  const onWithdrawFailure = (block, error) => {
    // Seems like every batched tx gets handled?
    if (txResWasHandled.current === true) {
      return;
    }
    showError('Withdrawal failed');
    txResWasHandled.current = true;
    setStatus(TxStatus.failed(block, error));
  };

  const onWithdrawUpdate = (message) => {
    setStatus(TxStatus.processing(message));
  };

  const onClickSend = async () => {
    setStatus(TxStatus.processing());
    selectCoins();
    const txResHandler = makeTxResHandler(
      api,
      onWithdrawSuccess,
      onWithdrawFailure,
      onWithdrawUpdate
    );
    let transactions = [];
    if (coinSelection.current.length % 2 === 1) {
      const mintZeroCoinPayload = await generateMintZeroCoinPayload();
      const mintZeroCoinTx =
        api.tx.mantaPay.mintPrivateAsset(mintZeroCoinPayload);
      transactions.push(mintZeroCoinTx);
      coinSelection.current.push(mintZeroCoinAsset.current);
    }
    for (let i = 0; i < coinSelection.current.length; i += 2) {
      const inputAsset1 = coinSelection.current[i];
      const inputAsset2 = coinSelection.current[i + 1];
      const privateTransferPayload = await generatePrivateTransferPayload(
        inputAsset1,
        inputAsset2
      );
      const privateTransferTransaction = api.tx.mantaPay.privateTransfer(
        privateTransferPayload
      );
      transactions.push(privateTransferTransaction);
    }
    const unsub = api.tx.utility
      .batch(transactions)
      .signAndSend(currentExternalAccount, txResHandler);
    setUnsub(() => unsub);
  };

  const insufficientFunds = false; // todo
  const formIsDisabled = status && status.isProcessing();
  const buttonIsDisabled =
    formIsDisabled || insufficientFunds || !privateTransferAmount.gt(new BN(0));

  const onChangeSendAmountInput = (amountStr) => {
    setSendAmountInput(amountStr);
    try {
      setPrivateTransferAmount(new BN(amountStr));
    } catch (error) {
      return;
    }
  };

  const onClickMax = () => {
    onChangeSendAmountInput(privateBalance.toString());
  };

  const onChangeReceiverAddress = (e) => {
    try {
      setReceiverAddress(
        new MantaAssetShieldedAddress(base64Decode(e.target.value))
      );
    } catch (e) {
      setReceiverAddress(null);
    }
  };

  const balanceString =
    privateBalance &&
    selectedAssetType &&
    `Available: ${privateBalance.toString()} private ${
      selectedAssetType.ticker
    }`;

  const addressValidationText = 'Receiver';

  return (
    <div className="send-content">
      <div className="py-2">
        <FormSelect
          label="Token"
          selectedOption={selectedAssetType}
          setSelectedOption={setSelectedAssetType}
          options={CurrencyType.AllCurrencies()}
          disabled={formIsDisabled}
        />
        <FormInput
          value={sendAmountInput}
          onChange={(e) => onChangeSendAmountInput(e.target.value)}
          onClickMax={onClickMax}
          type="text"
        >
          {balanceString}
        </FormInput>
      </div>
      <img className="mx-auto" src={Svgs.ArrowDownIcon} alt="switch-icon" />
      <div className="py-2">
        <FormInput
          onChange={onChangeReceiverAddress}
          prefixIcon={Svgs.WalletIcon}
          isMax={false}
          type="text"
        >
          {addressValidationText}
        </FormInput>
      </div>
      {status?.isProcessing() ? (
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

export default SendTab;
