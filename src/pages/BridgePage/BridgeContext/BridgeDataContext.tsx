// @ts-nocheck
import React, { useReducer, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useExternalAccount } from 'contexts/externalAccountContext';
import Balance from 'types/Balance';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import { setLastAccessedExternalAccountAddress } from 'utils/persistence/externalAccountStorage';
import AssetType from 'types/AssetType';
import { useMetamask } from 'contexts/metamaskContext';
import Chain from 'types/Chain';
import bridgeReducer, { buildInitState } from './bridgeReducer';
import BRIDGE_ACTIONS from './bridgeActions';
import { Bridge } from 'manta-polkawallet-bridge-dev/build';
import { useConfig } from 'contexts/configContext';
import { firstValueFrom } from 'rxjs';

const BridgeDataContext = React.createContext();

export const BridgeDataContextProvider = (props) => {
  const { ethAddress, configureMoonRiver } = useMetamask();
  const config = useConfig();
  const {
    externalAccount,
    externalAccountSigner,
    externalAccountOptions,
    changeExternalAccount
  } = useExternalAccount();

  const [state, dispatch] = useReducer(bridgeReducer, buildInitState(config));

  const {
    senderAssetType,
    senderAssetTargetBalance,
    senderSubstrateAccount,
    originChainOptions,
    originChain,
    destinationChain,
    bridge,
  } = state;

  const originAddress = originChain.ethMetadata ? ethAddress : senderSubstrateAccount?.address;
  const destinationAddress = destinationChain.ethMetadata ? ethAddress : senderSubstrateAccount?.address;

  useEffect(() => {
    const initBridge = async () => {
      if (state.bridge || !externalAccount || !externalAccountSigner || !originChainOptions) {
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
      senderBalanceObserveable.subscribe(handleBalanceChange);
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

    const subscribeInputConfig = async () => {
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
      const inputConfig = await firstValueFrom(inputConfigObservable);
      handleInputConfigChange(inputConfig);
    }
    subscribeInputConfig();
  },[senderAssetType, senderAssetTargetBalance, originAddress, originChain, destinationChain, bridge])

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
  // The active `senderSubstrateAccount` sends and covers fees for all
  // substrate-based payments
  useEffect(() => {
    const syncSenderSubstrateAccountToExternalAccount = () => {
      if (senderAssetType?.assetId === AssetType.Moonriver(config).assetId) {
        dispatch({
          type: BRIDGE_ACTIONS.SET_SENDER_SUBSTRATE_ACCOUNT,
          senderSubstrateAccount: null
        });
      } else {
        dispatch({
          type: BRIDGE_ACTIONS.SET_SENDER_SUBSTRATE_ACCOUNT,
          senderSubstrateAccount: externalAccount
        });
      }
    };
    syncSenderSubstrateAccountToExternalAccount();
  }, [externalAccount]);

  // Sets the polkadot.js signing and fee-paying account in 'externalAccountContext'
  // to match the user's public account as set in the send form
  useEffect(() => {
    const syncExternalAccountToSubstrateAccount = () => {
      senderSubstrateAccount && changeExternalAccount(senderSubstrateAccount);
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
  const setSenderSubstrateAccount = async (senderSubstrateAccount) => {
    setLastAccessedExternalAccountAddress(senderSubstrateAccount.address);
    await changeExternalAccount(senderSubstrateAccount);
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
    if (originChain.name === Chain.Moonriver(config).name) {
      configureMoonRiver()
    }
    dispatch({
      type: BRIDGE_ACTIONS.SET_ORIGIN_CHAIN,
      originChain
    });
  };

  // Sets the destination chain
  const setDestinationChain = (destinationChain) => {
    if (destinationChain.name === Chain.Moonriver(config).name) {
      configureMoonRiver()
    }
    dispatch({
      type: BRIDGE_ACTIONS.SET_DESTINATION_CHAIN,
      destinationChain
    });
  };

  const value = {
    setSenderAssetTargetBalance,
    setSenderSubstrateAccount,
    setSelectedAssetType,
    setOriginChain,
    setDestinationChain,
    ...state
  };

  return (
    <BridgeDataContext.Provider value={value}>{props.children}</BridgeDataContext.Provider>
  );
};

BridgeDataContextProvider.propTypes = {
  children: PropTypes.any
};

export const useBridgeData = () => ({ ...useContext(BridgeDataContext) });
