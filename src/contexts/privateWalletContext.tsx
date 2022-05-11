// @ts-nocheck
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { BN } from 'bn.js';
import Balance from 'types/Balance';
import Version from 'types/Version';
import Api from 'manta-wasm-wallet-api';
import config from 'config';
import * as axios from 'axios';
import { base58Decode, base58Encode } from '@polkadot/util-crypto';
import { useExternalAccount } from './externalAccountContext';
import { useSubstrate } from './substrateContext';

const PrivateWalletContext = createContext();

export const PrivateWalletContextProvider = (props) => {
  const { api, socket } = useSubstrate();
  const { externalAccountSigner } = useExternalAccount();
  const [privateAddress, setPrivateAddress] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [wasm, setWasm] = useState(null);
  const [wasmApi, setWasmApi] = useState(null);
  const [signerIsConnected, setSignerIsConnected] = useState(null);
  const [signerVersion, setSignerVersion] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(wallet && signerIsConnected);
  }, [wallet, signerIsConnected]);

  // WASM wallet must be reinitialized when socket changes
  // because the old api will have been disconnected
  useEffect(() => {
    setIsReady(false);
  }, [socket]);


  useEffect(() => {
    const getPrivateAddress = async (wasm, wallet) => {
      const keys = await wallet.receiving_keys(new wasm.ReceivingKeyRequest('GetAll'));
      const privateAddressRaw = keys[0];
      const privateAddressBytes = [...privateAddressRaw.spend, ...privateAddressRaw.view];
      return base58Encode(privateAddressBytes);
    };

    const canInitWallet = () => {
      return api && externalAccountSigner && signerIsConnected;
    };

    const initWallet = async () => {
      console.log("INITIALIZING");
      await api.isReady;
      const wasm = await import('manta-wasm-wallet');
      const wasmSigner = new wasm.Signer(config.SIGNER_URL);
      const wasmApi = new Api(api, externalAccountSigner);
      const wasmLedger = new wasm.PolkadotJsLedger(wasmApi);
      const wasmWallet = new wasm.Wallet(wasmLedger, wasmSigner);
      const privateAddress = await getPrivateAddress(wasm, wasmWallet);
      await wasmWallet.recover();
      setWasm(wasm);
      setPrivateAddress(privateAddress);
      setWasmApi(wasmApi);
      setWallet(wasmWallet);
    };

    if (canInitWallet() && !isReady) {
      initWallet();
    }

  }, [api, externalAccountSigner, signerIsConnected]);


  const fetchSignerVersion = async () => {
    try {
      const res = await axios.get(`${config.SIGNER_URL}version`, { timeout: 200 });
      const signerVersion = res.data;
      const signerIsConnected = !!signerVersion;
      setSignerIsConnected(signerIsConnected);
      if (signerIsConnected) {
        setSignerVersion(new Version(signerVersion));
      } else {
        setSignerIsConnected(signerIsConnected);
        setSignerVersion(null);
      }
    } catch (err) {
      setSignerIsConnected(false);
      setSignerVersion(null);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      fetchSignerVersion();
    }, 2000);
    return () => clearInterval(interval);
  }, [api, wallet]);


  const getSpendableBalance = async (assetType) => {
    if (!isReady) {
      return null;
    }
    const balanceRaw = wallet.balance(new wasm.AssetId(assetType.assetId));
    return new Balance(assetType, new BN(balanceRaw));
  };

  const toPrivate = async (balance, txResHandler) => {
    const value = balance.valueAtomicUnits.toString();
    const assetId = balance.assetType.assetId;
    const txJson = `{ "Mint": { "id": ${assetId}, "value": "${value}" }}`;
    const transaction = wasm.Transaction.from_string(txJson);
    wasmApi.txResHandler = txResHandler;
    wasmApi.externalAccountSigner = externalAccountSigner;
    const res = await wallet.post(transaction, null);
    console.log(res);
    return res;
  };

  const toPublic = async (balance, txResHandler) => {
    const value = balance.valueAtomicUnits.toString();
    const assetId = balance.assetType.assetId;
    const txJson = `{ "Reclaim": { "id": ${assetId}, "value": "${value}" }}`;
    const transaction = wasm.Transaction.from_string(txJson);
    const assetMetadataJson = `{ "decimals": ${balance.assetType.numberOfDecimals} , "symbol": "${balance.assetType.ticker}" }`;
    const assetMetadata = wasm.AssetMetadata.from_string(assetMetadataJson);
    wasmApi.txResHandler = txResHandler;
    wasmApi.externalAccountSigner = externalAccountSigner;
    const res = await wallet.post(transaction, assetMetadata);
    console.log(res);
    return res;
  };

  const privateTransfer = async (balance, recipient, txResHandler) => {
    const addressJson = privateAddressToJson(recipient);
    const value = balance.valueAtomicUnits.toString();
    const assetId = balance.assetType.assetId;
    const txJson = `{ "PrivateTransfer": [{ "id": ${assetId}, "value": "${value}" }, ${addressJson} ]}`;
    const transaction = wasm.Transaction.from_string(txJson);
    const assetMetadataJson = `{ "decimals": ${balance.assetType.numberOfDecimals} , "symbol": "${balance.assetType.ticker}" }`;
    const assetMetadata = wasm.AssetMetadata.from_string(assetMetadataJson);
    wasmApi.txResHandler = txResHandler;
    wasmApi.externalAccountSigner = externalAccountSigner;
    const res = await wallet.post(transaction, assetMetadata);
    console.log(res);
    return res;
  };

  const privateAddressToJson = (privateAddress) => {
    const bytes = base58Decode(privateAddress);
    return JSON.stringify({
      spend: Array.from(bytes.slice(0, 32)),
      view: Array.from(bytes.slice(32))
    });
  };

  const sync = async () => {
    await wallet.sync();
  };

  const value = {
    isReady,
    privateAddress,
    getSpendableBalance,
    toPrivate,
    toPublic,
    privateTransfer,
    sync,
    signerIsConnected,
    signerVersion,
  };

  return (
    <PrivateWalletContext.Provider value={value}>
      {props.children}
    </PrivateWalletContext.Provider>
  );
};

PrivateWalletContextProvider.propTypes = {
  children: PropTypes.any
};

export const usePrivateWallet = () => ({ ...useContext(PrivateWalletContext) });
