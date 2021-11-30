import React, { useState, useRef, useEffect } from 'react';
import Button from 'components/elements/Button';
import MantaLoading from 'components/elements/Loading';
import { showSuccess, showError } from 'utils/ui/Notifications';
import FormInput from 'components/elements/Form/FormInput';
import AssetType from 'types/AssetType';
import { useExternalAccount } from 'contexts/externalAccountContext';
import Decimal from 'decimal.js';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import TxStatus from 'types/TxStatus';
import { useSubstrate } from 'contexts/substrateContext';
import { makeTxResHandler } from 'utils/api/MakeTxResHandler';
import { selectCoins } from 'coin-selection';
import { SignerInterface, BrowserAddressStore } from 'signer-interface';
import config from 'config';
import { useTxStatus } from 'contexts/txStatusContext';
import PropTypes from 'prop-types';
import getBalanceString from 'utils/ui/getBalanceString';
import Balance from 'types/Balance';
import {
  getIsInsuficientFunds,
  getToPublicButtonIsDisabled
} from 'utils/ui/formValidation';

const ToPublicTab = ({ selectedAssetType }) => {
  const { api } = useSubstrate();
  const { getSpendableBalance, getSpendableAssetsByAssetId } =
    usePrivateWallet();
  const { externalAccountSigner } = useExternalAccount();
  const { txStatus, setTxStatus } = useTxStatus();

  const [withdrawAmountInput, setWithdrawAmountInput] = useState('');
  const [reclaimAmount, setReclaimAmount] = useState(null);
  const txResWasHandled = useRef(null);
  const coinSelection = useRef(null);
  const signerInterface = useRef(null);
  const [privateBalance, setPrivateBalance] = useState(null);

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

  const onReclaimSuccess = async (block) => {
    // Every tx in the batch gets handled by default, only handle 1
    if (txResWasHandled.current === true) {
      return;
    }
    showSuccess('Withdrawal successful');
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

  const onClickWithdraw = async () => {
    signerInterface.current = new SignerInterface(
      api,
      new BrowserAddressStore(config.BIP_44_COIN_TYPE_ID)
    );
    const signerIsConnected = await signerInterface.current.signerIsConnected();
    if (!signerIsConnected) {
      showError('Open Manta Signer desktop app and sign in to continue');
      return;
    }

    txResWasHandled.current = false;
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
      api.tx.utility
        .batch(transactions)
        .signAndSend(externalAccountSigner, txResHandler);
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

  const insufficientFunds = getIsInsuficientFunds(
    reclaimAmount,
    privateBalance
  );
  const buttonIsDisabled = getToPublicButtonIsDisabled(
    reclaimAmount,
    insufficientFunds,
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

ToPublicTab.propTypes = {
  selectedAssetType: PropTypes.instanceOf(AssetType)
};

export default ToPublicTab;