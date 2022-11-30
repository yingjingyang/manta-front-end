// @ts-nocheck
import React, { useReducer, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useExternalAccount } from 'contexts/externalAccountContext';
import Balance from 'types/Balance';
import BN from 'bn.js';
import Decimal from 'decimal.js';
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
    externalAccountSigner
  } = useExternalAccount();

  const [state, dispatch] = useReducer(bridgeReducer, buildInitState(config));

  const {
    senderAssetType,
    senderAssetTargetBalance,
    originChainOptions,
    originChain,
    destinationChain,
    bridge,
    destinationAddress
  } = state;

  const originAddress = originChain.xcmAdapter.chain.type === 'ethereum'
    ? ethAddress
    : externalAccount?.address;

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
    const setDestinationAddressOnChangeChain = () => {
      const originChainIsEvm = originChain.xcmAdapter.chain.type === 'ethereum';
      const destinationChainIsEvm = destinationChain.xcmAdapter.chain.type === 'ethereum';
      if (originChainIsEvm || destinationChainIsEvm) {
        dispatch({
          type: BRIDGE_ACTIONS.SET_DESTINATION_ADDRESS,
          destinationAddress: null
        });
      } else {
        dispatch({
          type: BRIDGE_ACTIONS.SET_DESTINATION_ADDRESS,
          destinationAddress: externalAccount?.address
        });
      }
    }
    setDestinationAddressOnChangeChain();
  }, [originChain, destinationChain, externalAccount])


  const subscribeBalanceChanges = (assetType, handler) => {
    if (!assetType || !originAddress || !bridge || !originChain) {
      return
    }
    const balanceObserveable = originChain.xcmAdapter.subscribeTokenBalance(
      assetType.baseTicker, originAddress
    );
    return balanceObserveable.subscribe(handler);
  }

  useEffect(() => {
    const handleSenderNativeAssetBalanceChange = (balanceData) => {
      const senderNativeAssetCurrentBalance = Balance.fromBaseUnits(
        originChain.nativeAsset,
        balanceData.free
      );
      dispatch({
        type: BRIDGE_ACTIONS.SET_SENDER_NATIVE_ASSET_CURRENT_BALANCE,
        senderNativeAssetCurrentBalance
      })
    }
    const subscription = subscribeBalanceChanges(
      originChain.nativeAsset, handleSenderNativeAssetBalanceChange
    );
    return () => subscription?.unsubscribe();
  }, [senderAssetType, originAddress, originChain, bridge])

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
    const subscription = subscribeBalanceChanges(senderAssetType, handleBalanceChange);
    return () => subscription?.unsubscribe();
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
      );
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
  },[senderAssetType, senderAssetTargetBalance, originAddress, destinationAddress, originChain, destinationChain, bridge])

  /**
   *
   * Mutations exposed through UI
   */

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

  // Sets the destination address (only used when bridging too or from EVM chains like Moonriver)
  const setDestinationAddress = (destinationAddress) => {
    dispatch({
      type: BRIDGE_ACTIONS.SET_DESTINATION_ADDRESS,
      destinationAddress
    });
  }

  // Switches origin and destination chain
  const switchOriginAndDestination = () => {
    dispatch({
      type: BRIDGE_ACTIONS.SWITCH_ORIGIN_AND_DESTINATION,
    });
  }

  const value = {
    originAddress,
    setSenderAssetTargetBalance,
    setSelectedAssetType,
    setOriginChain,
    setDestinationChain,
    setDestinationAddress,
    switchOriginAndDestination,
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
