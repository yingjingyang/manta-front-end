// @ts-nocheck
import React, { useReducer, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useExternalAccount } from 'contexts/externalAccountContext';
import Balance from 'types/Balance';
import BN from 'bn.js';
import { useTxStatus } from 'contexts/txStatusContext';
import TxStatus from 'types/TxStatus';
import { setLastAccessedExternalAccountAddress } from 'utils/persistence/externalAccountStorage';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { transferKarFromCalamariToKarura, transferKarFromKaruraToCalamari, transferRocFromCalamariToRococo, transferRocFromRococoToCalamari } from 'utils/api/XCM';
import extrinsicWasSentByUser from 'utils/api/ExtrinsicWasSendByUser';
import bridgeReducer, { BRIDGE_INIT_STATE } from './bridgeReducer';
import BRIDGE_ACTIONS from './bridgeActions';

const BridgeContext = React.createContext();

export const BridgeContextProvider = (props) => {
  const [originFee, setOriginFee] = useState(null);


  const { setTxStatus, txStatus } = useTxStatus();
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
    senderPublicAccount,
    originChain,
    originChainOptions,
    destinationChain,
    chainApis
  } = state;

  const mapChainsToExtrinsic = (valueAtomicUnits, address) => {
    if (originChain.name === 'Dolphin') {
      if (destinationChain.name === 'Rococo') {
        return transferRocFromCalamariToRococo(
          api,
          address,
          valueAtomicUnits
        );
      } else if (destinationChain.name === 'Karura') {
        return transferKarFromCalamariToKarura(
          api,
          address,
          valueAtomicUnits
        );
      }
    } else if (originChain.name === 'Rococo' && destinationChain.name === 'Dolphin') {
      return transferRocFromRococoToCalamari(
        api,
        address,
        valueAtomicUnits
      );
    } else if (originChain.name === 'Karura' && destinationChain.name === 'Dolphin') {
      return transferKarFromKaruraToCalamari(
        api,
        address,
        valueAtomicUnits
      );
    } else {
      throw new Error('Invalid XCM transfer');
    }
  };

  /**
   * Initialization logic
   */

  // Adds the user's polkadot.js accounts to state on pageload
  // These populate public address select dropdowns in the ui
  useEffect(() => {
    const initPublicAccountOptions = () => {
      dispatch({
        type: BRIDGE_ACTIONS.SET_SENDER_PUBLIC_ACCOUNT_OPTIONS,
        senderPublicAccountOptions: externalAccountOptions
      });
    };
    initPublicAccountOptions();
  }, [externalAccountOptions]);

  useEffect(() => {
    const initChainApis = async () => {
      const chainApis = {};
      for (let i = 0; i < originChainOptions.length; i++) {
        const chain = originChainOptions[i];
        const socket = new WsProvider(chain.socket);
        const api = await ApiPromise.create({provider: socket, types: chain.apiTypes});
        chainApis[chain.name] = api;
      }
      dispatch({
        type: BRIDGE_ACTIONS.SET_CHAIN_APIS,
        chainApis: chainApis
      });
    };
    if (!chainApis) {
      initChainApis();
    }

  }, [originChainOptions]);

  const getChainApi = () => {
    if (!originChain || !chainApis) {
      return null;
    }
    return chainApis[originChain.name];
  };
  const api = getChainApi();

  /**
   * External state
   */

  // Synchronizes the user's current 'active' public account in local state
  // to match its upstream source of truth in `externalAccountContext`
  // The active `senderPublicAccount` receivs `toPublic` payments,
  // send `toPrivate` and `publicTransfer` payments, and covers fees for all payments
  useEffect(() => {
    const syncPublicAccountToExternalAccount = () => {
      dispatch({
        type: BRIDGE_ACTIONS.SET_SENDER_PUBLIC_ACCOUNT,
        senderPublicAccount: externalAccount
      });
    };
    syncPublicAccountToExternalAccount();
  }, [externalAccount]);

  // Sets the polkadot.js signing and fee-paying account in 'externalAccountContext'
  // to match the user's public account as set in the send form
  useEffect(() => {
    const syncExternalAccountToPublicAccount = () => {
      senderPublicAccount && changeExternalAccount(senderPublicAccount);
    };
    syncExternalAccountToPublicAccount();
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
  const setSenderPublicAccount = async (senderPublicAccount) => {
    setLastAccessedExternalAccountAddress(senderPublicAccount.address);
    await changeExternalAccount(senderPublicAccount);
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

  // Dispatches the user's available balance to local state for the currently selected account and asset
  const setSenderAssetCurrentBalance = (
    senderAssetCurrentBalance,
    senderPublicAddress
  ) => {
    dispatch({
      type: BRIDGE_ACTIONS.SET_SENDER_ASSET_CURRENT_BALANCE,
      senderAssetCurrentBalance,
      senderPublicAddress
    });
  };

  // Dispatches the user's available public balance for the currently selected fee-paying account to local state
  const setSenderNativeTokenBalance = (
    senderNativeTokenPublicBalance
  ) => {
    dispatch({
      type: BRIDGE_ACTIONS.SET_SENDER_NATIVE_TOKEN_PUBLIC_BALANCE,
      senderNativeTokenPublicBalance
    });
  };

  // Gets available public balance for some public address and asset type
  const fetchBalance = async () => {
    const address = senderPublicAccount?.address;
    if (!address || !senderAssetType || !api) {
      return null;
    }
    await api.isReady;
    let balance;
    switch(originChain.name) {
    case 'Calamari':
      balance = await fetchBalanceMantaChain(address, senderAssetType);
      break;
    case 'Dolphin':
      balance = await fetchBalanceMantaChain(address, senderAssetType);
      break;
    case 'Rococo':
      balance = await fetchBalanceRococoChain(address, senderAssetType);
      break;
    case 'Karura':
      balance = await fetchBalanceKaruraChain(address, senderAssetType);
      break;
    default:
      throw new Error('Unrecognized chain');
    }
    setSenderAssetCurrentBalance(balance);
  };

  const fetchBalanceRococoChain = async (address, assetType) => {
    if (assetType.baseTicker !== 'ROC') {
      return null;
    }
    const balance = await fetchNativeTokenBalance(address, assetType);
    return balance;

  };

  const fetchBalanceKaruraChain = async (address, assetType) => {
    if (assetType.baseTicker !== 'KAR') {
      return null;
    }
    const balance = await fetchNativeTokenBalance(address, assetType);
    return balance;
  };

  const fetchBalanceMantaChain = async (address, assetType) => {
    if (assetType.isNativeToken) {
      const balance = await fetchNativeTokenBalance(address, assetType);
      return balance;
    }
    const account = await api.query.assets.account(assetType.assetId, address);
    const balanceString = account.value.isEmpty
      ? '0'
      : account.value.balance.toString();
    return new Balance(assetType, new BN(balanceString));
  };

  const fetchNativeTokenBalance = async (address, assetType) => {
    if (!api || !address || !assetType) {
      return null;
    }
    await api.isReady;
    const balances = await api.query.system.account(address);
    return new Balance(
      assetType,
      new BN(balances.data.free.toString())
    );
  };

  // Gets the available public balance for the user's public account set to pay transaction fee
  const fetchFeeBalance = async () => {
    if (!api || !externalAccount) {
      return;
    }
    const address = externalAccount.address;
    const balance = await fetchNativeTokenBalance(address, originChain.nativeAsset);
    setSenderNativeTokenBalance(balance, address);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchBalance();
      fetchFeeBalance();
    }, 200);
    return () => clearInterval(interval);
  }, [
    originChain,
    senderAssetType,
    externalAccount,
    senderPublicAccount,
    api,
    txStatus
  ]);

  /**
   *
   * Transaction validation
   */

  // Gets the highest amount the user is allowed to send for the currently
  // selected asset
  const getMaxSendableBalance = () => {
    if (!senderAssetCurrentBalance || !senderNativeTokenPublicBalance || !senderAssetType) {
      return null;
    }
    if (senderAssetType.isNativeToken) {
      const reservedNativeTokenBalance = getReservedNativeTokenBalance();
      const zeroBalance = new Balance(senderAssetType, new BN(0));
      return Balance.max(
        senderAssetCurrentBalance.sub(reservedNativeTokenBalance),
        zeroBalance
      );
    }
    return senderAssetCurrentBalance.valueOverExistentialDeposit();
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
    const maxSendableBalance = getMaxSendableBalance();
    return maxSendableBalance.gte(senderAssetTargetBalance);
  };

  // Checks if the user has enough native token to pay fees & publish a transaction
  const userCanPayFee = () => {
    if (!senderNativeTokenPublicBalance) {
      return null;
    }
    let requiredNativeTokenBalance = getReservedNativeTokenBalance();
    if (senderAssetType?.isNativeToken) {
      requiredNativeTokenBalance = requiredNativeTokenBalance.add(
        senderAssetTargetBalance
      );
    }
    return senderNativeTokenPublicBalance.gte(requiredNativeTokenBalance);
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

  const getDestinationFee = () => {
    let valueAtomicUnits;
    if (originChain.name === 'Dolphin') {
      if (destinationChain.name === 'Rococo') {
        valueAtomicUnits = new BN('11523248');
      } else if (destinationChain.name === 'Karura') {
        valueAtomicUnits = new BN('9324000000');
      }
    } else if (originChain.name === 'Rococo') {
      if (destinationChain.name === 'Dolphin') {
        valueAtomicUnits = new BN('666666667');
      }
    } else if (originChain.name === 'Karura') {
      if (destinationChain.name === 'Dolphin') {
        valueAtomicUnits = new BN('100000000000');
      }
    } else {
      return null;
    }
    return new Balance(
      senderAssetType, valueAtomicUnits
    );
  };

  const getOriginFee = async () => {
    console.log('api', api);
    if (!api) {
      return null;
    }
    const valueAtomicUnits = senderAssetTargetBalance?.valueAtomicUnits || new BN(0);
    const address = senderPublicAccount?.address || '5HDoTPBGGxfnkg6DNacyvCz6FzENJ2bgWkas239VfY9CGq72';
    const tx = mapChainsToExtrinsic(valueAtomicUnits, address);
    console.log('tx.paymentInfo', tx.paymentInfo(address));
    const pasymentInfo = await tx.paymentInfo(address);
    const originFee = new Balance(
      originChain.nativeAsset, pasymentInfo.partialFee
    );
    setOriginFee(originFee);
  };
  if (!originFee) {
    getOriginFee();
  }

  const destinationFee = getDestinationFee();

  // Checks that it is valid to attempt a transaction
  const isValidToSend = () => {
    return (
      api &&
      externalAccountSigner &&
      senderAssetTargetBalance &&
      senderAssetCurrentBalance &&
      userHasSufficientFunds() &&
      userCanPayFee() &&
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
    const tx = mapChainsToExtrinsic(
      senderAssetTargetBalance.valueAtomicUnits,
      senderPublicAccount.address
    );
    try {
      await tx.signAndSend(externalAccountSigner, handleTxRes);
    } catch (error) {
      console.error('Transaction failed', error);
      setTxStatus(TxStatus.failed());
      return false;
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
    setSenderPublicAccount,
    setSelectedAssetType,
    setOriginChain,
    setDestinationChain,
    originFee,
    destinationFee,
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
