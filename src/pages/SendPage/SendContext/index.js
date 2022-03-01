import React, { useReducer, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSubstrate } from 'contexts/substrateContext';
import { useExternalAccount } from 'contexts/externalAccountContext';
import { setLastAccessedExternalAccountAddress } from 'utils/persistence/externalAccountStorage';
import Balance from 'types/Balance';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import sendReducer, { SEND_INIT_STATE } from './sendReducer';
import SEND_ACTIONS from './sendActions';


const SendContext = React.createContext();

export const SendContextProvider = (props) => {
  const { api } = useSubstrate();
  const { externalAccount, externalAccountOptions, changeExternalAccount } = useExternalAccount();
  const {
    spendableAssets,
    // getSpendableAssetsByAssetId,
    getSpendableBalance,
    // signerIsConnected,
    // signerVersion
  } = usePrivateWallet();

  const initState = { ...SEND_INIT_STATE };
  const [state, dispatch] = useReducer(sendReducer, initState);
  // const { receiverIsPrivate, senderPublicAccountOptions } = state;
  const { senderAssetType, senderPublicAccount, receiverAddress } = state;


  const toggleSenderAccountIsPrivate = () => {
    dispatch({ type: SEND_ACTIONS.TOGGLE_SENDER_ACCOUNT_IS_PRIVATE });
  };

  const toggleReceiverAccountIsPrivate = () => {
    dispatch({ type: SEND_ACTIONS.TOGGLE_RECEIVER_ACCOUNT_IS_PRIVATE });
  };

  const setSenderAssetType = (senderAssetType) => {
    dispatch({ type: SEND_ACTIONS.SET_SENDER_ASSET_TYPE, senderAssetType });
  };

  const setSenderAssetCurrentBalance = (senderAssetCurrentBalance) => {
    dispatch({
      type: SEND_ACTIONS.SET_SENDER_ASSET_CURRENT_BALANCE, senderAssetCurrentBalance
    });
  };

  const setReceiver = (receiverIsInternal, receiverIsPrivate, receiverAddress) => {
    dispatch({
      type: SEND_ACTIONS.SET_RECEIVER,
      receiverIsInternal,
      receiverIsPrivate,
      receiverAddress
    });
  };

  const setSenderPublicAccount = async (senderPublicAccount) => {
    setLastAccessedExternalAccountAddress(senderPublicAccount);
    await changeExternalAccount(senderPublicAccount);
  };

  useEffect(() => {
    dispatch({
      type: SEND_ACTIONS.SET_SENDER_PUBLIC_ACCOUNT_OPTIONS, senderPublicAccountOptions: externalAccountOptions
    });
  }, [externalAccountOptions]);

  useEffect(() => {
    dispatch({
      type: SEND_ACTIONS.SET_SENDER_PUBLIC_ACCOUNT, senderPublicAccount: externalAccount
    });
  }, [externalAccount]);

  useEffect(() => {
    const fetchSenderAssetPublicBalance = async () => {
      const balanceRaw = await api.query.mantaPay.balances(
        senderPublicAccount.address,
        senderAssetType.assetId
      );
      const balance = new Balance(senderAssetType, balanceRaw);
      setSenderAssetCurrentBalance(balance);
    };

    const fetchSenderAssetPrivateBalance = () => {
      setSenderAssetCurrentBalance(getSpendableBalance(senderAssetType));
    };

    if (!senderAssetType.isPrivate && senderPublicAccount) {
      fetchSenderAssetPublicBalance();
    } else if (senderAssetType.isPrivate) {
      fetchSenderAssetPrivateBalance();
    }
  }, [senderAssetType, senderPublicAccount, spendableAssets]);

  const value = {
    setSenderPublicAccount,
    toggleSenderAccountIsPrivate,
    toggleReceiverAccountIsPrivate,
    setSenderAssetType,
    setReceiver,
    ...state
  };

  return (
    <SendContext.Provider value={value}>
      {props.children}
    </SendContext.Provider>
  );
};

SendContextProvider.propTypes = {
  children: PropTypes.any
};

export const useSend = () => ({ ...useContext(SendContext) });
