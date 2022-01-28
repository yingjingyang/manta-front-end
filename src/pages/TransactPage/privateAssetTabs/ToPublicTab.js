import React, { useState, useRef, useEffect } from 'react';
import Button from 'components/elements/Button';
import MantaLoading from 'components/elements/Loading';
import { showSuccess, showError } from 'utils/ui/Notifications';
import FormInput from 'pages/SendPage/SendFromForm/SendAmountInput';
import { useExternalAccount } from 'contexts/externalAccountContext';
import Decimal from 'decimal.js';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import TxStatus from 'types/TxStatus';
import { useSubstrate } from 'contexts/substrateContext';
import { makeTxResHandler } from 'utils/api/MakeTxResHandler';
import { selectCoins } from 'coin-selection';
import { SignerInterface } from 'signer-interface';
import signerInterfaceConfig from 'config/signerInterfaceConfig';
import { useTxStatus } from 'contexts/txStatusContext';
import getBalanceString from 'utils/ui/getBalanceString';
import Balance from 'types/Balance';
import { getToPublicButtonIsDisabled } from 'utils/ui/formValidation';
import { useSelectedAssetType } from 'contexts/selectedAssetTypeContext';
import { useNativeTokenWallet } from 'contexts/nativeTokenWalletContext';

const ToPublicTab = () => {
  const { api } = useSubstrate();
  const { getSpendableBalance, getSpendableAssetsByAssetId } =
    usePrivateWallet();
  const { externalAccountSigner } = useExternalAccount();
  const { txStatus, setTxStatus } = useTxStatus();
  const { selectedAssetType } = useSelectedAssetType();
  const { getUserCanPayFee } = useNativeTokenWallet();

  const [withdrawAmountInput, setWithdrawAmountInput] = useState('');
  const [reclaimAmount, setReclaimAmount] = useState(null);
  const txResWasHandled = useRef(null);
  const coinSelection = useRef(null);
  const signerInterface = useRef(null);
  const [privateBalance, setPrivateBalance] = useState(null);

  useEffect(() => {
    const refreshAssetType = () => {
      onChangeWithdrawAmountInput(withdrawAmountInput);
    };
    refreshAssetType();
  }, [selectedAssetType]);

  useEffect(() => {
    const displaySpendableBalance = async () => {
      if (!api) {
        return;
      }
      await api.isReady;
      selectedAssetType &&
        setPrivateBalance(getSpendableBalance(selectedAssetType));
    };
    displaySpendableBalance();
  }, [selectedAssetType, txStatus, getSpendableBalance, api]);

  const onReclaimSuccess = async (block, extrinsic = '') => {
    // Every tx in the batch gets handled by default, only handle 1
    if (txResWasHandled.current === true) {
      return;
    }
    showSuccess('Withdrawal successful', extrinsic);
    signerInterface.current.cleanupTxSuccess();
    coinSelection.current = null;
    txResWasHandled.current = true;
    setTxStatus(TxStatus.finalized(block));
  };

  const onReclaimFailure = async (block, error) => {
    // Every tx in the batch gets handled by default, only handle 1
    if (txResWasHandled.current === true) {
      return;
    }
    console.error(error);
    signerInterface.current.cleanupTxFailure();
    txResWasHandled.current = true;
    setTxStatus(TxStatus.failed(block, error));
    showError('Withdrawal failed');
  };

  const onReclaimUpdate = (message) => {
    setTxStatus(TxStatus.processing(message));
  };

  const handleUserCannotPayFee = () => {
    setTxStatus(TxStatus.failed());
    showError('Withdrawal failed: cannot pay fee');
  };

  const onClickWithdraw = async () => {
    txResWasHandled.current = false;
    signerInterface.current = new SignerInterface(api, signerInterfaceConfig);
    const signerIsConnected = await signerInterface.current.signerIsConnected();
    if (!signerIsConnected) {
      showError('Open Manta Signer desktop app and sign in to continue');
      return;
    }
    setTxStatus(TxStatus.processing());

    coinSelection.current = selectCoins(
      reclaimAmount.valueAtomicUnits,
      getSpendableAssetsByAssetId(selectedAssetType.assetId),
      selectedAssetType.assetId
    );
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
      const batchTx = api.tx.utility.batch(transactions);
      const userCanPayFee = await getUserCanPayFee(batchTx);
      if (!userCanPayFee) {
        handleUserCannotPayFee();
        return;
      }
      batchTx.signAndSend(externalAccountSigner, txResHandler);
    } catch (error) {
      console.error(error);
      onReclaimFailure();
    }
  };

  const onChangeWithdrawAmountInput = (amountStr) => {
    setWithdrawAmountInput(amountStr);
    try {
      setReclaimAmount(
        Balance.fromBaseUnits(selectedAssetType, new Decimal(amountStr))
      );
    } catch (error) {
      setReclaimAmount(null);
    }
  };

  const onClickMax = () => {
    privateBalance &&
      onChangeWithdrawAmountInput(privateBalance.toString(false));
  };

  const buttonIsDisabled = getToPublicButtonIsDisabled(
    reclaimAmount,
    privateBalance,
    txStatus
  );

  return (
    <>
      <div className="pb-6">
        <FormInput
          type="number"
          step="0.01"
          value={withdrawAmountInput}
          onChange={(e) => onChangeWithdrawAmountInput(e.target.value)}
          onClickMax={onClickMax}
        >
          {getBalanceString(privateBalance)}
        </FormInput>
      </div>
      {txStatus?.isProcessing() ? (
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

export default ToPublicTab;
