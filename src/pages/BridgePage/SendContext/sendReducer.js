import AssetType from 'types/AssetType';
import { getDefaultPrivateReceiver, getDefaultPublicReceiver, getDefaultSenderAssetType } from './defaults';
import SEND_ACTIONS from './sendActions';

export const SEND_INIT_STATE = {
  senderPublicAccount: null,
  senderPublicAccountOptions: null,
  senderAccountIsPrivate: false,

  senderAssetType: getDefaultSenderAssetType(AssetType.AllCurrencies(false)),
  senderAssetTypeOptions: AssetType.AllCurrencies(false),
  senderAssetCurrentBalance: null,
  senderAssetTargetBalance: null,

  receiverIsInternal: true,
  receiverIsPrivate: true,
  receiverAddress: getDefaultPrivateReceiver(),
};

const sendReducer = (state, action) => {
  switch (action.type) {
  case SEND_ACTIONS.TOGGLE_SENDER_ACCOUNT_IS_PRIVATE:
    return toggleSenderAccountIsPrivate(state);

  case SEND_ACTIONS.TOGGLE_RECEIVER_ACCOUNT_IS_PRIVATE:
    return toggleReceiverAccountIsPrivate(state);

  case SEND_ACTIONS.SET_SENDER_ASSET_TYPE:
    return setSenderAssetType(state, action);

  case SEND_ACTIONS.SET_SENDER_PUBLIC_ACCOUNT:
    return setSenderPublicAccount(state, action);

  case SEND_ACTIONS.SET_SENDER_PUBLIC_ACCOUNT_OPTIONS:
    return setSenderPublicAccountOptions(state, action);

  case SEND_ACTIONS.SET_SENDER_ASSET_CURRENT_BALANCE:
    return setSenderAssetCurrentBalance(state, action);

  case SEND_ACTIONS.SET_RECEIVER:
    return setReceiver(state, action);

  default:
    throw new Error(`Unknown type: ${action.type}`);
  }
};

const toggleSenderAccountIsPrivate = (state) => {
  const senderAccountIsPrivate = !state.senderAccountIsPrivate;
  const senderAssetTypeOptions = AssetType.AllCurrencies(senderAccountIsPrivate);
  const senderAssetType = getDefaultSenderAssetType(senderAssetTypeOptions, state);

  return {
    ...state,
    senderAssetCurrentBalance: null,
    senderAccountIsPrivate,
    senderAssetTypeOptions,
    senderAssetType,
  };
};

const toggleReceiverAccountIsPrivate = (state) => {
  const receiverIsPrivate = !state.receiverIsPrivate;
  const receiverAddress = receiverIsPrivate
    ? getDefaultPrivateReceiver()
    : getDefaultPublicReceiver(state);
  return { ...state, receiverIsPrivate, receiverAddress };
};

const setSenderAssetType = (state, action) => {
  return {
    ...state,
    senderAssetCurrentBalance: null,
    senderAssetType: action.senderAssetType
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
  return {
    ...state,
    senderAssetCurrentBalance: action.senderAssetCurrentBalance
  };
};

const setReceiver  = (state, action) => {
  return {
    ...state,
    receiverIsInternal: action.receiverIsInternal,
    receiverIsPrivate: action.receiverIsPrivate,
    receiverAddress: action.receiverAddress,
  };
};

export default sendReducer;
