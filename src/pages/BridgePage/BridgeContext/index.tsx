// @ts-nocheck
import React, { useReducer, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useExternalAccount } from 'contexts/externalAccountContext';
import Balance from 'types/Balance';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import { useTxStatus } from 'contexts/txStatusContext';
import TxStatus from 'types/TxStatus';
import { setLastAccessedExternalAccountAddress } from 'utils/persistence/externalAccountStorage';
import extrinsicWasSentByUser from 'utils/api/ExtrinsicWasSendByUser';
import AssetType from 'types/AssetType';
import { useMetamask } from 'contexts/metamaskContext';
import Chain from 'types/Chain';
import { transferMovrFromMoonriverToCalamari } from 'eth/EthXCM';
import bridgeReducer, { BRIDGE_INIT_STATE } from './bridgeReducer';
import BRIDGE_ACTIONS from './bridgeActions';
import { FixedPointNumber } from '@acala-network/sdk-core';
import { Bridge } from '@polkawallet/bridge/build';

const BridgeContext = React.createContext();

export const BridgeContextProvider = (props) => {
  const { provider, ethAddress, configureMoonRiver } = useMetamask();
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
    senderOriginSubstrateAccount,
    senderDestinationSubstrateAccount,
    originChainOptions,
    originChain,
    destinationChain,
    bridge,
    maxInput,
    minInput
  } = state;

  const originAddress = originChain.ethMetadata
    ? ethAddress
    : senderOriginSubstrateAccount?.address;

  const destinationAddress = destinationChain.ethMetadata
    ? ethAddress
    : senderDestinationSubstrateAccount?.address;

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
        Decimal.max(new Decimal(inputConfig.maxInput.toString()), new Decimal(0))
      )
    }
    const getMinInput = (inputConfig) => {
      return Balance.fromBaseUnits(
        senderAssetType,
        new Decimal(inputConfig.minInput.toString())
      )
    }

    const handleInputConfigChange = (inputConfig) => {
      dispatch({
        type: BRIDGE_ACTIONS.SET_FEE_ESTIMATES,
        originFee: getOriginFee(inputConfig),
        destinationFee: getDestinationFee(inputConfig),
        maxInput: getMaxInput(inputConfig),
        minInput: getMinInput(inputConfig)
      });
    }

    const getInputConfigParams = () => {
      const amount = senderAssetTargetBalance
        ? senderAssetTargetBalance.valueBaseUnits.toString()
        : "0";

      let address = destinationAddress;
      // Can't estimate fees for eth addresses like on Moonriver; use any substrate address instead
      if (destinationAddress === ethAddress) {
        const ARBITRARY_ADDRESS = '5HDoTPBGGxfnkg6DNacyvCz6FzENJ2bgWkas239VfY9CGq72';
        address = ARBITRARY_ADDRESS;
      };

      return {
        signer: originAddress,
        address: address,
        amount: amount,
        to: destinationChain.name,
        token: senderAssetType.baseTicker
      };
    }

    const subscribeInputConfig= () => {
      if (
        !senderAssetType
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
    if (originChain.name === Chain.Moonriver().name) {
      configureMoonRiver()
    }
    dispatch({
      type: BRIDGE_ACTIONS.SET_ORIGIN_CHAIN,
      originChain
    });
  };

  // Sets the destination chain
  const setDestinationChain = (destinationChain) => {
    if (destinationChain.name === Chain.Moonriver().name) {
      configureMoonRiver()
    }
    dispatch({
      type: BRIDGE_ACTIONS.SET_DESTINATION_CHAIN,
      destinationChain
    });
  };


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
      api &&
      senderAssetTargetBalance &&
      senderAssetCurrentBalance &&
      userCanSign() &&
      userHasSufficientFunds() &&
      txIsOverMinAmount()
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
    const success = await transferMovrFromMoonriverToCalamari(
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
    txIsOverMinAmount,
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
