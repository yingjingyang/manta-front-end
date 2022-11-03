// @ts-nocheck
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useExternalAccount } from 'contexts/externalAccountContext';
import { useTxStatus } from 'contexts/txStatusContext';
import TxStatus from 'types/TxStatus';
import extrinsicWasSentByUser from 'utils/api/ExtrinsicWasSendByUser';
import { useMetamask } from 'contexts/metamaskContext';
import { transferMovrFromMoonriverToCalamari } from 'eth/EthXCM';
import { FixedPointNumber } from '@acala-network/sdk-core';
import { useConfig } from 'contexts/configContext';
import { useBridgeData } from './BridgeDataContext';

const BridgeTxContext = React.createContext();

export const BridgeTxContextProvider = (props) => {
  const config = useConfig();
  const { provider } = useMetamask();
  const { setTxStatus } = useTxStatus();
  const { externalAccount, externalAccountSigner } = useExternalAccount();
  const {
    senderAssetType,
    senderAssetCurrentBalance,
    senderAssetTargetBalance,
    senderSubstrateAccount,
    originChain,
    destinationChain,
    maxInput,
    minInput
  } = useBridgeData();

  /**
   *
   * Transaction validation
   */

  // Checks if the user has enough funds to pay for a transaction
  const userHasSufficientFunds = () => {
    if (!maxInput || !senderAssetTargetBalance) {
      return null;
    } else if (
      senderAssetTargetBalance?.assetType.assetId !==
      maxInput?.assetType.assetId
    ) {
      return null;
    }
    return senderAssetTargetBalance.lte(maxInput);
  };

  const txIsOverMinAmount = () => {
    if (!minInput || !senderAssetTargetBalance) {
      return null;
    } else if (
      senderAssetTargetBalance?.assetType.assetId !==
      minInput?.assetType.assetId
    ) {
      return null;
    }
    return senderAssetTargetBalance.gte(minInput);
  }

  const userCanSign = () => {
    if (senderAssetType?.ethMetadata) {
      return provider !== null;
    } else {
      return externalAccountSigner !== null;
    }
  };

  // Checks that it is valid to attempt a transaction
  const isValidToSend = () => {
    return (
      originChain?.api &&
      senderAssetTargetBalance &&
      senderAssetCurrentBalance &&
      userCanSign() &&
      userHasSufficientFunds() &&
      txIsOverMinAmount()
    );
  };

  /**
   *
   * Transactions
   */

  // Handles the result of a transaction
  const handleTxRes = async ({ status, events }) => {
    const api = originChain.api;
    if (status.isInBlock) {
      for (const event of events) {
        if (api.events.system.ExtrinsicFailed.is(event.event)) {
          setTxStatus(TxStatus.failed());
          console.error('Transaction failed', event);
        } else if (api.events.system.ExtrinsicSuccess.is(event.event)) {
          try {
            console.log('status.asInBlock', status.asInBlock)
            console.log('api', api)
            const signedBlock = await api.rpc.chain.getBlock(status.asInBlock);
            const extrinsics = signedBlock.block.extrinsics;
            const extrinsic = extrinsics.find((extrinsic) =>
              extrinsicWasSentByUser(extrinsic, externalAccount, api)
            );
            const extrinsicHash = extrinsic.hash.toHex();
            setTxStatus(TxStatus.finalized(extrinsicHash));
            setTxStatus(TxStatus.finalized())
          } catch(error) {
            console.error(error);
          }
        }
      }
    }
  };

  // Attempts to build and send a bridge transaction
  const send = async () => {
    if (!isValidToSend()) {
      return;
    }
    setTxStatus(TxStatus.processing());
    if (originChain.xcmAdapter.chain.type === "ethereum") {
      await sendEth();
    } else {
      await sendSubstrate();
    }
  };

  // Attempts to build and send a bridge transaction with a substrate origin chain
  const sendSubstrate = async () => {
    const value =  senderAssetTargetBalance.valueAtomicUnits.toString();
    const tx = originChain.xcmAdapter.createTx({
      amount: FixedPointNumber.fromInner(value, 10),
      to: destinationChain.name,
      token: senderAssetTargetBalance.assetType.baseTicker,
      address: senderSubstrateAccount.address,
    });
    try {
      const injected = await web3FromSource(externalAccount.meta.source);
      originChain.api.setSigner(injected.signer);
      await tx.signAndSend(externalAccountSigner, handleTxRes);
    } catch (error) {
      console.error('Transaction failed', error);
      setTxStatus(TxStatus.failed());
    }
  };

  // Attempts to build and send a bridge transaction with an Eth-like origin chain
  const sendEth = async () => {
    const success = await transferMovrFromMoonriverToCalamari(
      config, provider, senderAssetTargetBalance, senderSubstrateAccount.address
    );
    if (success) {
      setTxStatus(TxStatus.finalized());
    } else {
      setTxStatus(TxStatus.failed());
    }
  };

  const value = {
    userHasSufficientFunds,
    txIsOverMinAmount,
    isValidToSend,
    send
  };

  return (
    <BridgeTxContext.Provider value={value}>{props.children}</BridgeTxContext.Provider>
  );
};

BridgeTxContextProvider.propTypes = {
  children: PropTypes.any
};

export const useBridgeTx = () => ({ ...useContext(BridgeTxContext) });
