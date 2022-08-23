// @ts-nocheck
import React, { useReducer, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useExternalAccount } from 'contexts/externalAccountContext';
import Balance from 'types/Balance';
import BN from 'bn.js';
import { useTxStatus } from 'contexts/txStatusContext';
import TxStatus from 'types/TxStatus';
import { setLastAccessedExternalAccountAddress } from 'utils/persistence/externalAccountStorage';
import extrinsicWasSentByUser from 'utils/api/ExtrinsicWasSendByUser';
import AssetType from 'types/AssetType';
import { useMetamask } from 'contexts/metamaskContext';
import Chain from 'types/Chain';
import { transferMovrFromMoonriverToDolphin } from 'utils/api/EthXCM';
import bridgeReducer, { BRIDGE_INIT_STATE } from './bridgeReducer';
import BRIDGE_ACTIONS from './bridgeActions';
import { FixedPointNumber } from '@acala-network/sdk-core';
import { Bridge } from '@polkawallet/bridge/build';

// todo: fixed precision >>> decimal

const BridgeContext = React.createContext();

export const BridgeContextProvider = (props) => {
  const { provider, ethAddress } = useMetamask();
  const { setTxStatus } = useTxStatus();
  const {
    externalAccount,
    externalAccountSigner,
    externalAccountOptions,
    changeExternalAccount
  } = useExternalAccount();
  const initState = { ...BRIDGE_INIT_STATE };
  const [state, dispatch] = useReducer(bridgeReducer, initState);

  const {
    senderAssetType,
    senderAssetCurrentBalance,
    senderAssetTargetBalance,
    senderNativeTokenPublicBalance,
    senderOriginSubstrateAccount,
    senderDestinationSubstrateAccount,
    originChainOptions,
    originChain,
    destinationChain,
    bridge,
    maxInput,
  } = state;

  const originAddress = (originChain.name === "moonriver")
    ? ethAddress
    : senderOriginSubstrateAccount?.address;

  useEffect(() => {
    const initBridge = async () => {
      if (!externalAccount || !externalAccountSigner || !originChainOptions) {
        return
      };
      const adapters = originChainOptions.map(chain => chain.xcmAdapter);
      const bridge = new Bridge({ adapters });
      for await (const chain of originChainOptions) {
        await chain.initXcmAdapter();
      };
      dispatch({
        type: BRIDGE_ACTIONS.SET_BRIDGE,
        bridge,
      });
    };
    initBridge();
  }, [externalAccountSigner, externalAccount, originChainOptions]);


  useEffect(() => {
    const handleBalanceChange = (balanceData) => {
      const senderAssetCurrentBalance = Balance.fromBaseUnits(
        senderAssetType,
        balanceData.free
      );
      dispatch({
        type: BRIDGE_ACTIONS.SET_SENDER_ASSET_CURRENT_BALANCE,
        senderAssetCurrentBalance
      })
    }

    const subscribeBalanceChanges = async () => {
      if (!senderAssetType || !originAddress || !bridge || !originChain) {
        return
      }
      const senderBalanceObserveable = originChain.xcmAdapter.subscribeTokenBalance(
        senderAssetType.baseTicker, originAddress
      );
      const senderBalanceSubscription = senderBalanceObserveable.subscribe(handleBalanceChange);
      dispatch({
        type: BRIDGE_ACTIONS.SET_SENDER_BALANCE_SUBSCRIPTION,
        senderBalanceSubscription,
      });
    }
    subscribeBalanceChanges()
  }, [senderAssetType, originAddress, originChain, bridge])

  useEffect(() => {
    const getDestinationFee = (inputConfig) => {
      return Balance.fromBaseUnits(
        senderAssetType,
        inputConfig.destFee.balance
      )
    }
    const getOriginFee = (inputConfig) => {
      return new Balance(
        originChain.nativeAsset,
        new BN(inputConfig.estimateFee)
      )
    }
    const getMaxInput = (inputConfig) => {
      return Balance.fromBaseUnits(
        senderAssetType,
        inputConfig.maxInput
      )
    }
    const getMinInput = (inputConfig) => {
      return Balance.fromBaseUnits(
        senderAssetType,
        inputConfig.minInput
      )
    }

    const handleInputConfigChange = (inputConfig) => {
      console.log('inputConfig', inputConfig);
      dispatch({
        type: BRIDGE_ACTIONS.SET_FEE_ESTIMATES,
        originFee: getOriginFee(inputConfig),
        destinationFee: getDestinationFee(inputConfig),
        maxInput: getMaxInput(inputConfig),
        minInput: getMinInput(inputConfig)
      });
    }

    const getInputConfigParams = () => {
      return {
        signer: originAddress,
        address: senderDestinationSubstrateAccount.address, // todo: should generalize
        amount: new FixedPointNumber(senderAssetTargetBalance.valueBaseUnits.toString()),
        to: destinationChain.name,
        token: senderAssetType.baseTicker
      };
    }

    const subscribeInputConfig= () => {
      if (
        !senderAssetType
        || !senderAssetTargetBalance
        || !originAddress
        || !bridge
        || !originChain
      ) {
        return
      };
      const inputConfigParams = getInputConfigParams()
      const inputConfigObservable = originChain.xcmAdapter.subscribeInputConfigs(inputConfigParams);
      const inputConfigSubscription = inputConfigObservable.subscribe(handleInputConfigChange)
      dispatch({
        type: BRIDGE_ACTIONS.SET_INPUT_CONFIG_SUBSCRIPTION,
        inputConfigSubscription,
      });
    }
    subscribeInputConfig()
  },[senderAssetType, senderAssetTargetBalance, originAddress, originChain, bridge])

  /**
   * Initialization logic
   */

  // Adds the user's polkadot.js accounts to state on pageload
  // These populate public address select dropdowns in the ui
  useEffect(() => {
    const initPublicAccountOptions = () => {
      dispatch({
        type: BRIDGE_ACTIONS.SET_SENDER_SUBSTRATE_ACCOUNT_OPTIONS,
        senderSubstrateAccountOptions: externalAccountOptions
      });
    };
    initPublicAccountOptions();
  }, [externalAccountOptions]);

  /**
   * External state
   */

  // Synchronizes the user's current 'active' public account in local state
  // to match its upstream source of truth in `externalAccountContext`
  // The active `senderOriginSubstrateAccount` sends and covers fees for all
  // substrate-based payments
  useEffect(() => {
    const syncSenderOriginSubstrateAccountToExternalAccount = () => {
      if (senderAssetType?.assetId === AssetType.Moonriver().assetId) {
        dispatch({
          type: BRIDGE_ACTIONS.SET_SENDER_ORIGIN_SUBSTRATE_ACCOUNT,
          senderOriginSubstrateAccount: null
        });
      } else {
        dispatch({
          type: BRIDGE_ACTIONS.SET_SENDER_ORIGIN_SUBSTRATE_ACCOUNT,
          senderOriginSubstrateAccount: externalAccount
        });
      }
    };
    syncSenderOriginSubstrateAccountToExternalAccount();
  }, [externalAccount]);

  // Sets the polkadot.js signing and fee-paying account in 'externalAccountContext'
  // to match the user's public account as set in the send form
  useEffect(() => {
    const syncExternalAccountToSubstrateAccount = () => {
      senderOriginSubstrateAccount && changeExternalAccount(senderOriginSubstrateAccount);
    };
    syncExternalAccountToSubstrateAccount();
  }, [
    senderAssetType,
    externalAccountOptions
  ]);

  /**
   *
   * Mutations exposed through UI
   */

  // Sets the sender's public account, exposed in the `To Public` and `Public transfer` form;
  // State is set upstream in `externalAccountContext`, and propagates downstream here
  // (see `syncPublicAccountToExternalAccount` above)
  const setSenderOriginSubstrateAccount = async (senderOriginSubstrateAccount) => {
    setLastAccessedExternalAccountAddress(senderOriginSubstrateAccount.address);
    await changeExternalAccount(senderOriginSubstrateAccount);
  };

  const setSenderDestinationSubstrateAccount = async (senderDestinationSubstrateAccount) => {
    dispatch(
      {
        type: BRIDGE_ACTIONS.SET_SENDER_DESTINATION_SUBSTRATE_ACCOUNT,
        senderDestinationSubstrateAccount
      }
    );
  };

  // Sets the asset type to be transacted
  const setSelectedAssetType = (selectedAssetType) => {
    dispatch({ type: BRIDGE_ACTIONS.SET_SELECTED_ASSET_TYPE, selectedAssetType });
  };

  // Sets the balance the user intends to send
  const setSenderAssetTargetBalance = (senderAssetTargetBalance) => {
    dispatch({
      type: BRIDGE_ACTIONS.SET_SENDER_ASSET_TARGET_BALANCE,
      senderAssetTargetBalance
    });
  };

  // Sets the origin chain
  const setOriginChain = (originChain) => {
    dispatch({
      type: BRIDGE_ACTIONS.SET_ORIGIN_CHAIN,
      originChain
    });
  };

  // Sets the destination chain
  const setDestinationChain = (destinationChain) => {
    dispatch({
      type: BRIDGE_ACTIONS.SET_DESTINATION_CHAIN,
      destinationChain
    });
  };


  /**
   *
   * Balance refresh logic
   */


  /**
   *
   * Transaction validation
   */

  // Gets the highest amount the user is allowed to send for the currently
  // selected asset
  const getMaxSendableBalance = () => {
    // if (!senderAssetCurrentBalance || !senderNativeTokenPublicBalance || !senderAssetType) {
    //   return null;
    // }
    // if (senderAssetType.isNativeToken) {
    //   const reservedNativeTokenBalance = getReservedNativeTokenBalance();
    //   const zeroBalance = new Balance(senderAssetType, new BN(0));
    //   return Balance.max(
    //     senderAssetCurrentBalance.sub(reservedNativeTokenBalance),
    //     zeroBalance
    //   );
    // }
    // return senderAssetCurrentBalance.valueOverExistentialDeposit();
  };

  // Gets the amount of the native token the user is not allowed to go below
  // If the user attempts a transaction with less than this amount of the
  // native token, the transaction will fail
  const getReservedNativeTokenBalance = () => {
    if (!senderNativeTokenPublicBalance) {
      return null;
    }
    const conservativeFeeEstimate = Balance.fromBaseUnits(
      originChain.nativeAsset,
      0.1
    );
    const existentialDeposit = new Balance(
      originChain.nativeAsset,
      originChain.nativeAsset.existentialDeposit
    );
    return conservativeFeeEstimate.add(existentialDeposit);
  };

  // Returns true if the current tx would cause the user to go below a
  // recommended min fee balance of 1. This helps prevent users from
  // accidentally becoming unable to transact because they cannot pay fees
  const txWouldDepleteSuggestedMinFeeBalance = () => {
    if (
      senderAssetCurrentBalance?.assetType.isNativeToken &&
      senderAssetTargetBalance?.assetType.isNativeToken
    ) {
      const SUGGESTED_MIN_FEE_BALANCE = Balance.fromBaseUnits(
        originChain.nativeAsset,
        1
      );
      const balanceAfterTx = senderAssetCurrentBalance.sub(
        senderAssetTargetBalance
      );
      return SUGGESTED_MIN_FEE_BALANCE.gte(balanceAfterTx);
    }
    return false;
  };

  // Checks if the user has enough funds to pay for a transaction
  const userHasSufficientFunds = () => {
    if (!senderAssetTargetBalance || !senderAssetCurrentBalance || !senderAssetType) {
      return null;
    }
    if (
      senderAssetTargetBalance.assetType.assetId !==
      senderAssetCurrentBalance.assetType.assetId
    ) {
      return null;
    }
    console.log('maxInput', maxInput.toString());
    return maxInput.gte(senderAssetTargetBalance);
  };

  // Checks if the user has enough native token to pay fees & publish a transaction
  const userCanPayFee = () => {
    return true;
    // if (!senderNativeTokenPublicBalance) {
    //   return null;
    // }
    // let requiredNativeTokenBalance = getReservedNativeTokenBalance();
    // if (senderAssetType?.isNativeToken) {
    //   requiredNativeTokenBalance = requiredNativeTokenBalance.add(
    //     senderAssetTargetBalance
    //   );
    // }
    // return senderNativeTokenPublicBalance.gte(requiredNativeTokenBalance);
  };

  const userCanSign = () => {
    if (senderAssetType?.assetId === AssetType.Moonriver().assetId) {
      return provider !== null;
    } else {
      return externalAccountSigner !== null;
    }
  };

  // Checks the user is sending at least the existential deposit
  const receiverAmountIsOverExistentialBalance = () => {
    if (!senderAssetTargetBalance) {
      return null;
    }
    return senderAssetTargetBalance.valueAtomicUnits.gte(
      senderAssetType.existentialDeposit // revisit
    );
  };

  // Checks that it is valid to attempt a transaction
  const isValidToSend = () => {
    console.log (
      api,
      senderAssetTargetBalance,
      senderAssetCurrentBalance,
      userCanSign(),
      userHasSufficientFunds(),
      userCanPayFee(),
      receiverAmountIsOverExistentialBalance()
    );
    return (
      api &&
      senderAssetTargetBalance &&
      senderAssetCurrentBalance &&
      userCanSign() &&
      userHasSufficientFunds() &&
      // userCanPayFee() &&
      receiverAmountIsOverExistentialBalance()
    );
  };

  /**
   *
   * Transaction logic
   */

  // Handles the result of a transaction
  const handleTxRes = async ({ status, events }) => {
    if (status.isInBlock) {
      for (const event of events) {
        if (api.events.system.ExtrinsicFailed.is(event.event)) {
          setTxStatus(TxStatus.failed());
          console.error('Transaction failed', event);
        } else if (api.events.system.ExtrinsicSuccess.is(event.event)) {
          try {
            console.log('status.asInBlock', status.asInBlock)
            const signedBlock = await api.rpc.chain.getBlock(status.asInBlock);
            const extrinsics = signedBlock.block.extrinsics;
            const extrinsic = extrinsics.find((extrinsic) =>
              extrinsicWasSentByUser(extrinsic, externalAccount, api)
            );
            const extrinsicHash = extrinsic.hash.toHex();
            setTxStatus(TxStatus.finalized(extrinsicHash));
          } catch(error) {
            console.error(error);
          }
        }
      }
    }
  };

  // Attempts to build and send a transaction
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

  const sendSubstrate = async () => {
    const value =  senderAssetTargetBalance.valueAtomicUnits.toString();
    const tx = originChain.xcmAdapter.createTx({
      amount: FixedPointNumber.fromInner(value, 10),
      to: destinationChain.name,
      token: senderAssetTargetBalance.assetType.baseTicker,
      address: senderDestinationSubstrateAccount.address,
    });
    try {
      await tx.signAndSend(externalAccountSigner, handleTxRes);
    } catch (error) {
      console.error('Transaction failed', error);
      setTxStatus(TxStatus.failed());
    }
  };

  const sendEth = async () => {
    const success = await transferMovrFromMoonriverToDolphin(
      provider, senderAssetTargetBalance, senderDestinationSubstrateAccount.address
    );
    if (success) {
      setTxStatus(TxStatus.finalized());
    } else {
      setTxStatus(TxStatus.failed());
    }
  };


  const value = {
    userHasSufficientFunds,
    userCanPayFee,
    getMaxSendableBalance,
    receiverAmountIsOverExistentialBalance,
    txWouldDepleteSuggestedMinFeeBalance,
    isValidToSend,
    setSenderAssetTargetBalance,
    setSenderOriginSubstrateAccount,
    setSenderDestinationSubstrateAccount,
    setSelectedAssetType,
    setOriginChain,
    setDestinationChain,
    send,
    ...state
  };

  return (
    <BridgeContext.Provider value={value}>{props.children}</BridgeContext.Provider>
  );
};

BridgeContextProvider.propTypes = {
  children: PropTypes.any
};

export const useBridge = () => ({ ...useContext(BridgeContext) });
