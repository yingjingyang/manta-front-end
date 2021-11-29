import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const TxStatusContext = createContext();

export const TxStatusContextProvider = (props) => {
  const [txStatus, setTxStatus] = useState(null);

  const value = {
    txStatus,
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

export const useTxStatus = () => ({
  ...useContext(TxStatusContext),
});
