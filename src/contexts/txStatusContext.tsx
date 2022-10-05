// @ts-nocheck
import React, { createContext, useState, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import TxStatus from 'types/TxStatus';

const TxStatusContext = createContext();

interface useTxStatusReturn {
  txStatus: TxStatus | null,
  txStatusRef: React.MutableRefObject<string | null>,
  setTxStatus: (status: string) => void
}

export const TxStatusContextProvider = (props) => {
  const [txStatus, _setTxStatus] = useState<TxStatus | null>(null);
  const txStatusRef = useRef<string | null>(null);

  const setTxStatus = (status: string) => {
    _setTxStatus(status);
    txStatusRef.current = status;
  }

  const value = {
    txStatus,
    txStatusRef,
    setTxStatus,
  };

  return (
    <TxStatusContext.Provider value={value}>
      {props.children}
    </TxStatusContext.Provider>
  );
};

TxStatusContextProvider.propTypes = {
  children: PropTypes.any,
};

export const useTxStatus: () => useTxStatusReturn = () => ({
  ...useContext(TxStatusContext),
});
