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
import { getToPrivateButtonIsDisabled } from 'utils/ui/formValidation';
import { useSelectedAssetType } from 'contexts/selectedAssetTypeContext';
import { useNativeTokenWallet } from 'contexts/nativeTokenWalletContext';
import PropTypes from 'prop-types';

const ToPrivateTab = () => {
  const { api } = useSubstrate();
  const { externalAccount, externalAccountSigner } = useExternalAccount();
  const { txStatus, setTxStatus } = useTxStatus();
  const { selectedAssetType } = useSelectedAssetType();
  const { getUserCanPayFee } = useNativeTokenWallet();

  const [depositAmountInput, setDepositAmountInput] = useState(null);
  const [mintAmount, setMintAmount] = useState(null);
  const [publicBalance, setPublicBalance] = useState(null);
  let signerInterface = useRef(null);

  useEffect(() => {
    const refreshAssetType = () => {
      onChangeDepositAmountInput(depositAmountInput);
    };
    refreshAssetType();
  }, [selectedAssetType]);

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

  const onDepositSuccess = (block, extrinsic = '') => {
    refreshPublicBalance();
    signerInterface.current.cleanupTxSuccess();
    setTxStatus(TxStatus.finalized(block));
    showSuccess('Deposit successful', extrinsic);
  };

  const onDepositFailure = (block, error) => {
    console.error(error);
    refreshPublicBalance();
    signerInterface.current.cleanupTxFailure();
    setTxStatus(TxStatus.failed(block, error));
    showError('Deposit failed');
  };

  const onDepositUpdate = (message) => {
    setTxStatus(TxStatus.processing(message));
  };

  const handleUserCannotPayFee = () => {
    setTxStatus(TxStatus.failed());
    showError('Transfer failed: cannot pay fee');
  };

  const onClickDeposit = async () => {
    signerInterface.current = new SignerInterface(
      api,
      new BrowserAddressStore(
        config.BIP_44_COIN_TYPE_ID,
        config.BASE_STORAGE_KEY
      )
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
      const userCanPayFee = await getUserCanPayFee(mintTx);
      if (!userCanPayFee) {
        handleUserCannotPayFee();
        return;
      }
      const txResHandler = makeTxResHandler(
        api,
        onDepositSuccess,
        onDepositFailure,
        onDepositUpdate
      );
      await mintTx.signAndSend(externalAccountSigner, txResHandler);
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
  const buttonIsDisabled = getToPrivateButtonIsDisabled(
    mintAmount,
    publicBalance,
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
  selectedAssetType: PropTypes.instanceOf(AssetType)
};

export default ToPrivateTab;
