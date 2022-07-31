// @ts-nocheck
import React, { useReducer, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { getLastSelectedNodeUrl } from 'utils/persistence/nodeSelectorStorage';
import config from '../config';
import types from '../config/types.json';

///
// Initial state for `useReducer`

const INIT_STATE = {
  socket: getLastSelectedNodeUrl() || config.PROVIDER_SOCKET,
  rpc: config.RPC,
  types: types,
  api: null,
  apiError: null,
  apiState: null,
  blockNumber: 0
};

///
// Reducer function for `useReducer`

const reducer = (state, action) => {
  switch (action.type) {
  case 'CONNECT_INIT':
    return { ...state, apiState: 'CONNECT_INIT' };

  case 'CONNECT':
    return { ...state, api: action.payload, apiState: 'CONNECTING' };

  case 'CONNECT_SUCCESS':
    return { ...state, apiState: 'READY' };

  case 'CONNECT_ERROR':
    return { ...state, apiState: 'ERROR', apiError: action.payload };

  case 'DISCONNECTED':
    const provider = action.payload;
    if (state.provider === provider) {
      return { ...state, apiState: 'DISCONNECTED' };
    }
    return state;

  case 'UPDATE_BLOCK':
    return { ...state, blockNumber: action.payload };

  case 'RESET_SOCKET':
    state.api.disconnect();
    return { ...INIT_STATE, socket: action.socket, apiState: 'CONNECTING' };

  default:
    throw new Error(`Unknown type: ${action.type}`);
  }
};

///
// Connecting to the Substrate node

const connect = async (state, dispatch) => {
  const { socket, types, rpc } = state;

  dispatch({ type: 'CONNECT_INIT' });

  const provider = new WsProvider(socket);
  const _api = new ApiPromise({ 
    provider,
    types,
    rpc
  });

  dispatch({ type: 'CONNECT', payload: _api });
  // Set listeners for disconnection and reconnection event.
  _api.on('connected', () => {
    console.log('polkadot.js api connected');
    dispatch({ type: 'CONNECT', payload: _api });
    // `ready` event is not emitted upon reconnection and is checked explicitly here.
    _api.isReady.then(async () => {
      dispatch({ type: 'CONNECT_SUCCESS' });
      await _api.rpc.chain.subscribeNewHeads((header) => {
        dispatch({ type: 'UPDATE_BLOCK', payload: header.number.toHuman() });
      });
    });
  });
  _api.on('ready', () => dispatch({ type: 'CONNECT_SUCCESS' }));
  _api.on('error', (err) => dispatch({ type: 'CONNECT_ERROR', payload: err }));
  _api.on('disconnected', () =>
    dispatch({ type: 'DISCONNECTED', payload: provider })
  );
};

const SubstrateContext = React.createContext();

const SubstrateContextProvider = (props) => {
  // filtering props and merge with default param value

  const resetSocket = (socket) => {
    dispatch({ type: 'RESET_SOCKET', socket });
  };

  const initState = { ...INIT_STATE };
  const neededPropNames = ['socket', 'types'];
  neededPropNames.forEach((key) => {
    initState[key] =
      typeof props[key] === 'undefined' ? initState[key] : props[key];
  });
  const [state, dispatch] = useReducer(reducer, initState);

  const { socket } = state;

  const value = {
    ...state,
    resetSocket
  };

  useEffect(() => {
    connect(state, dispatch);
  }, [socket]);

  return (
    <SubstrateContext.Provider value={value}>
      {props.children}
    </SubstrateContext.Provider>
  );
};

// prop typechecking
SubstrateContextProvider.propTypes = {
  socket: PropTypes.string,
  types: PropTypes.object,
  children: PropTypes.any
};

const useSubstrate = () => ({ ...useContext(SubstrateContext) });

export { SubstrateContextProvider, useSubstrate };
