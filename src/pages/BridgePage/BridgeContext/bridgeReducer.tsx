// @ts-nocheck
import { localStorageKeys } from 'constants/LocalStorageConstants';
import store from 'store';
import AssetType from 'types/AssetType';
import Balance from 'types/Balance';
import BRIDGE_ACTIONS from './bridgeActions';

const getInitialToken = () => {
  return AssetType.AllCurrencies(false).find(currency => currency.baseTicker === store.get(localStorageKeys.CurrentToken)) ?? AssetType.AllCurrencies(false)[0];
};

export const BRIDGE_INIT_STATE = {
  senderPublicAccount: null,
  senderPublicAccountOptions: [],

  senderAssetType: getInitialToken(store.get(localStorageKeys.IsPrivateSender, false)),
  senderAssetTypeOptions: AssetType.AllCurrencies(store.get(localStorageKeys.IsPrivateSender, false)),
  senderAssetCurrentBalance: null,
  senderAssetTargetBalance: null,
  senderNativeTokenPublicBalance: null,
};

const sendReducer = (state, action) => {
  switch (action.type) {

  case BRIDGE_ACTIONS.SET_SELECTED_ASSET_TYPE:
    return setSelectedAssetType(state, action);

  case BRIDGE_ACTIONS.SET_SENDER_PUBLIC_ACCOUNT:
    return setSenderPublicAccount(state, action);

  case BRIDGE_ACTIONS.SET_SENDER_PUBLIC_ACCOUNT_OPTIONS:
    return setSenderPublicAccountOptions(state, action);

  case BRIDGE_ACTIONS.SET_SENDER_ASSET_CURRENT_BALANCE:
    return setSenderAssetCurrentBalance(state, action);

  case BRIDGE_ACTIONS.SET_SENDER_ASSET_TARGET_BALANCE:
    return setSenderAssetTargetBalance(state, action);

  case BRIDGE_ACTIONS.SET_SENDER_NATIVE_TOKEN_PUBLIC_BALANCE:
    return setSenderNativeTokenPublicBalance(state, action);

  default:
    throw new Error(`Unknown type: ${action.type}`);
  }
};

const balanceUpdateIsStale = (stateAssetType, updateAssetType) => {
  if (!updateAssetType) {
    return false;
  }
  return stateAssetType.assetId !== updateAssetType.assetId
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

const setSenderPublicAccount = (state, action) => {
  return {
    ...state,
    senderAssetCurrentBalance: null,
    senderPublicAccount: action.senderPublicAccount
  };
};

const setSenderPublicAccountOptions = (state, action) => {
  return {
    ...state,
    senderPublicAccountOptions: action.senderPublicAccountOptions
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

export default sendReducer;
