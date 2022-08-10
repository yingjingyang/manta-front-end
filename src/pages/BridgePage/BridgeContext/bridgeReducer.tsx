// @ts-nocheck
import { localStorageKeys } from 'constants/LocalStorageConstants';
import store from 'store';
import AssetType from 'types/AssetType';
import Balance from 'types/Balance';
import Chain from 'types/Chain';
import BRIDGE_ACTIONS from './bridgeActions';

const getDestinationChainOptions = (originChain, originChainOptions) => {
  return originChainOptions
    .filter(chain => chain.name !== originChain.name)
    .filter(chain => originChain.canTransferXcm(chain));
};

const getSenderAssetTypeOptions = (originChain, destinationChain) => {
  return AssetType.AllCurrencies(false).filter(
    assetType => assetType.canTransferXcm(originChain, destinationChain));
};

const getNewSenderAssetType = (prevSenderAssetType, senderAssetTypeOptions) => {
  return (
    senderAssetTypeOptions.find(assetType => assetType.name === prevSenderAssetType?.name)
    || senderAssetTypeOptions[0] || null
  );
};

const initOriginChainOptions = Chain.All();
const initOriginChain = initOriginChainOptions[0];
const initDestinationChainOptions = getDestinationChainOptions(initOriginChain, initOriginChainOptions);
const initDestinationChain = initDestinationChainOptions[0];
const initSenderAssetTypeOptions = getSenderAssetTypeOptions(initOriginChain, initDestinationChain);
const initSenderAssetType = initSenderAssetTypeOptions[0];

export const BRIDGE_INIT_STATE = {
  senderEthAccount: null,
  senderSubstrateAccountOptions: [],

  senderAssetType: initSenderAssetType,
  senderAssetTypeOptions: initSenderAssetTypeOptions,
  senderAssetCurrentBalance: null,
  senderAssetTargetBalance: null,
  senderNativeTokenPublicBalance: null,

  senderOriginSubstrateAccount: null,
  originChain: initOriginChain,
  originChainOptions: initOriginChainOptions,
  originFee: null,

  senderDestinationSubstrateAccount: null,
  destinationChain: initDestinationChain,
  destinationChainOptions: initDestinationChainOptions,
  destinationFee: null,

  chainApis: null
};

const bridgeReducer = (state, action) => {
  switch (action.type) {

  case BRIDGE_ACTIONS.SET_SELECTED_ASSET_TYPE:
    return setSelectedAssetType(state, action);

  case BRIDGE_ACTIONS.SET_SENDER_DESTINATION_SUBSTRATE_ACCOUNT:
    return setSenderDestinationSubstrateAccount(state, action);

  case BRIDGE_ACTIONS.SET_SENDER_ORIGIN_SUBSTRATE_ACCOUNT:
    return setSenderOriginSubstrateAccount(state, action);

  case BRIDGE_ACTIONS.SET_SENDER_SUBSTRATE_ACCOUNT_OPTIONS:
    return setSenderSubstrateAccountOptions(state, action);

  case BRIDGE_ACTIONS.SET_SENDER_ASSET_CURRENT_BALANCE:
    return setSenderAssetCurrentBalance(state, action);

  case BRIDGE_ACTIONS.SET_SENDER_ASSET_TARGET_BALANCE:
    return setSenderAssetTargetBalance(state, action);

  case BRIDGE_ACTIONS.SET_SENDER_NATIVE_TOKEN_PUBLIC_BALANCE:
    return setSenderNativeTokenPublicBalance(state, action);

  case BRIDGE_ACTIONS.SET_ORIGIN_CHAIN:
    return setOriginChain(state, action);

  case BRIDGE_ACTIONS.SET_DESTINATION_CHAIN:
    return setDestinationChain(state, action);

  case BRIDGE_ACTIONS.SET_CHAIN_OPTIONS:
    return setChainOptions(state, action);

  case BRIDGE_ACTIONS.SET_CHAIN_APIS:
    return setChainApis(state, action);

  case BRIDGE_ACTIONS.SET_ORIGIN_FEE:
    return setOriginFee(state, action);

  case BRIDGE_ACTIONS.SET_DESTINATION_FEE:
    return setDestinationFee(state, action);

  default:
    throw new Error(`Unknown type: ${action.type}`);
  }
};

const balanceUpdateIsStale = (stateAssetType, updateAssetType) => {
  if (!updateAssetType) {
    return false;
  }
  return stateAssetType?.assetId !== updateAssetType.assetId;
};

const setSelectedAssetType = (state, action) => {
  store.set(localStorageKeys.CurrentToken, action.selectedAssetType.baseTicker);
  const senderAssetType = action.selectedAssetType;
  let senderAssetTargetBalance = null;
  if (state.senderAssetTargetBalance) {
    senderAssetTargetBalance = Balance.fromBaseUnits(
      senderAssetType, state.senderAssetTargetBalance.valueBaseUnits()
    );
  }
  return {
    ...state,
    senderAssetCurrentBalance: null,
    senderAssetTargetBalance,
    senderAssetType
  };
};

const setSenderOriginSubstrateAccount = (state, action) => {
  // if no destination account, initialize it to same as origin account
  const senderDestinationSubstrateAccount = (
    state.senderDestinationSubstrateAccount
    || action.senderOriginSubstrateAccount
  );

  return {
    ...state,
    senderAssetCurrentBalance: null,
    senderOriginSubstrateAccount: action.senderOriginSubstrateAccount,
    senderDestinationSubstrateAccount
  };
};

const setSenderDestinationSubstrateAccount = (state, action) => {
  return {
    ...state,
    senderDestinationSubstrateAccount: action.senderDestinationSubstrateAccount
  };
};

const setSenderSubstrateAccountOptions = (state, action) => {
  return {
    ...state,
    senderSubstrateAccountOptions: action.senderSubstrateAccountOptions
  };
};

const setSenderAssetCurrentBalance = (state, action) => {
  if (balanceUpdateIsStale(state?.senderAssetType, action.senderAssetCurrentBalance?.assetType)) {
    return state;
  }
  return {
    ...state,
    senderAssetCurrentBalance: action.senderAssetCurrentBalance
  };
};

const setSenderAssetTargetBalance = (state, action) => {
  return {
    ...state,
    senderAssetTargetBalance: action.senderAssetTargetBalance
  };
};

const setSenderNativeTokenPublicBalance = (state, action) => {
  return {
    ...state,
    senderNativeTokenPublicBalance: action.senderNativeTokenPublicBalance
  };
};

const setOriginChain = (state, { originChain }) => {
  let destinationChain = state.destinationChain;
  const destinationChainOptions = getDestinationChainOptions(originChain, state.originChainOptions);
  if (!originChain.canTransferXcm(destinationChain)) {
    destinationChain = destinationChainOptions[0];
  }
  const senderAssetTypeOptions = getSenderAssetTypeOptions(originChain, destinationChain);
  const senderAssetType = getNewSenderAssetType(state.senderAssetType, senderAssetTypeOptions);

  return {
    ...state,
    originChain,
    destinationChain,
    destinationChainOptions,
    senderAssetType,
    senderAssetTypeOptions,
    senderNativeTokenPublicBalance: null,
    senderAssetCurrentBalance: null
  };
};

const setDestinationChain = (state, { destinationChain }) => {
  const senderAssetTypeOptions = getSenderAssetTypeOptions(state.originChain, destinationChain);
  const senderAssetType = getNewSenderAssetType(state.senderAssetType, senderAssetTypeOptions);

  return {
    ...state,
    senderAssetTypeOptions,
    senderAssetType,
    destinationChain,
    senderNativeTokenPublicBalance: null,
    senderAssetCurrentBalance: null
  };
};

const setChainOptions = (state, { chainOptions }) => {
  const defaultOriginChain = chainOptions[0];
  const defaultDestinationChain = chainOptions[1];
  const destinationChainOptions = getDestinationChainOptions(defaultOriginChain, chainOptions);

  return {
    ...state,
    originChain: defaultOriginChain,
    originChainOptions: chainOptions,
    destinationChain: defaultDestinationChain,
    destinationChainOptions: destinationChainOptions,
    chainApis: []
  };
};

const setChainApis = (state, {chainApis}) => {
  return {
    ...state,
    chainApis
  };
};

const setOriginFee = (state, {originFee}) => {
  return {
    ...state,
    originFee
  };
};

const setDestinationFee = (state, {destinationFee}) => {
  return {
    ...state,
    destinationFee
  };
};

export default bridgeReducer;
