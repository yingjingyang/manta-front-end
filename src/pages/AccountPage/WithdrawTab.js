import React, { useState, useRef, useEffect } from 'react';
import Button from 'components/elements/Button';
import MantaLoading from 'components/elements/Loading';
import FormSelect from 'components/elements/Form/FormSelect';
import { showSuccess, showError } from 'utils/ui/Notifications';
import FormInput from 'components/elements/Form/FormInput';
import CurrencyType from 'types/CurrencyType';
import { useExternalAccount } from 'contexts/ExternalAccountContext';
import BN from 'bn.js';
import { useWallet } from 'contexts/WalletContext';
import TxStatus from 'types/TxStatus';
import { useSubstrate } from 'contexts/SubstrateContext';
import { makeTxResHandler } from 'utils/api/MakeTxResHandler';
import { selectCoins } from 'manta-coin-selection';
import SignerInterface from 'manta-signer-interface';
import { BrowserAddressStore } from 'manta-signer-interface';
import config from 'config';

const WithdrawTab = () => {
  const { api } = useSubstrate();
  const { getSpendableBalance, removeSpendableAsset, spendableAssets } =
    useWallet();
  const { currentExternalAccount } = useExternalAccount();

  const [selectedAssetType, setSelectedAssetType] = useState(null);
  const [withdrawAmountInput, setWithdrawAmountInput] = useState('');
  const [reclaimAmount, setReclaimAmount] = useState(new BN(-1));
  const [status, setStatus] = useState(null);
  const txResWasHandled = useRef(null);
  const coinSelection = useRef(null);
  const signerInterface = useRef(null);
  const [, setUnsub] = useState(null);
  const [privateBalance, setPrivateBalance] = useState(null);

  useEffect(() => {
    const displaySpendableBalance = async () => {
      if (!api) {
        return;
      }
      await api.isReady;
      selectedAssetType &&
        setPrivateBalance(getSpendableBalance(selectedAssetType.assetId, api));
    };
    displaySpendableBalance();
  }, [selectedAssetType, status, spendableAssets, api]);

  const onReclaimSuccess = async (block) => {
    // Every tx in the batch gets handled by default, only handle 1
    if (txResWasHandled.current === true) {
      return;
    }
    showSuccess('Withdrawal successful');
    coinSelection.current.coins.forEach((asset) => {
      removeSpendableAsset(asset, api);
    });
    signerInterface.current.cleanupTxSuccess();
    coinSelection.current = null;
    txResWasHandled.current = true;
    setStatus(TxStatus.finalized(block));
  };

  const onReclaimFailure = async (block, error) => {
    // Every tx in the batch gets handled by default, only handle 1
    if (txResWasHandled.current === true) {
      return;
    }
    console.error(error);
    signerInterface.current.cleanupTxFailure();
    txResWasHandled.current = true;
    setStatus(TxStatus.failed(block, error));
    showError('Withdrawal failed');
  };

  const onReclaimUpdate = (message) => {
    setStatus(TxStatus.processing(message));
  };

  const onClickWithdraw = async () => {
    setStatus(TxStatus.processing());
    coinSelection.current = selectCoins(reclaimAmount, spendableAssets);
    signerInterface.current = new SignerInterface(
      api,
      new BrowserAddressStore(config.BIP_44_COIN_TYPE_ID)
    );
    const signerIsConnected = await signerInterface.current.signerIsConnected();
    if (!signerIsConnected) {
      showError('Open Manta Signer desktop app and sign in to continue');
      return;
    }
    try {
      const transactions = await signerInterface.current.buildReclaimTxs(
        coinSelection.current
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
    } catch (error) {
      onReclaimFailure();
    }
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
