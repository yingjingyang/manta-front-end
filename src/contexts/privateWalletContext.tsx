// @ts-nocheck
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef
} from 'react';
import PropTypes from 'prop-types';
import { BN } from 'bn.js';
import Balance from 'types/Balance';
import Version from 'types/Version';
import Api from 'manta-wasm-wallet-api';
import config from 'config';
import * as axios from 'axios';
import { base58Decode, base58Encode } from '@polkadot/util-crypto';
import TxStatus from 'types/TxStatus';
import mapPostToTransaction from 'utils/api/MapPostToTransaction';
import { useExternalAccount } from './externalAccountContext';
import { useSubstrate } from './substrateContext';
import { useTxStatus } from './txStatusContext';

const PrivateWalletContext = createContext();

export const PrivateWalletContextProvider = (props) => {
  const { api, socket } = useSubstrate();
  const { externalAccountSigner } = useExternalAccount();
  const { setTxStatus } = useTxStatus();
  const [privateAddress, setPrivateAddress] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [wasm, setWasm] = useState(null);
  const [wasmApi, setWasmApi] = useState(null);
  const [signerIsConnected, setSignerIsConnected] = useState(null);
  const [signerVersion, setSignerVersion] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const walletIsBusy = useRef(false);
  const txQueue = useRef([]);
  const finalTxResHandler = useRef(null);

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
      console.log('INITIALIZING');
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
      const res = await axios.get(`${config.SIGNER_URL}version`, { timeout: 1500 });
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

  // WASM wallet doesn't allow you to call two methods at once, so before
  // calling methods it is necessary to wait for a pending call to finish
  const waitForWallet = async () => {
    while (walletIsBusy.current === true) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const sync = async () => {
    if (walletIsBusy.current === true) {
      return;
    }
    walletIsBusy.current = true;
    try {
      await wallet.sync();
    } catch (e) {
      console.error(e);
    }
    walletIsBusy.current = false;
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isReady) {
        sync();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [isReady]);

  const getSpendableBalance = async (assetType) => {
    if (!isReady) {
      return null;
    }
    await waitForWallet();
    const balanceRaw = wallet.balance(new wasm.AssetId(assetType.assetId));
    return new Balance(assetType, new BN(balanceRaw));
  };

  const toPrivate = async (balance, txResHandler) => {
    await waitForWallet();
    walletIsBusy.current = true;
    const value = balance.valueAtomicUnits.toString();
    const assetId = balance.assetType.assetId;
    const txJson = `{ "Mint": { "id": ${assetId}, "value": "${value}" }}`;
    const transaction = wasm.Transaction.from_string(txJson);
    wasmApi.txResHandler = txResHandler;
    wasmApi.externalAccountSigner = externalAccountSigner;
    const res = await wallet.post(transaction, null);
    walletIsBusy.current = false;
    console.log(res);
    return res;
  };

  const handleInternalTxRes = async ({ status, events }) => {
    if (status.isInBlock) {
      for (const event of events) {
        if (api.events.utility.BatchInterrupted.is(event.event)) {
          setTxStatus(TxStatus.failed());
          txQueue.current = [];
          console.error('Internal transaction failed', event);
        }
      }
    } else if (status.isFinalized) {
      console.log('Internal transaction finalized');
      await publishNextBatch();
    }
  };

  const publishNextBatch = async () => {
    const sendExternal = async () => {
      try {
        const lastTx = txQueue.current.shift();
        await lastTx.signAndSend(externalAccountSigner, finalTxResHandler.current);
      } catch (e) {
        setTxStatus(TxStatus.failed());
        txQueue.current = [];
      }
    };

    const sendInternal = async () => {
      try {
        const internalTx = txQueue.current.shift();
        await internalTx.signAndSend(externalAccountSigner, handleInternalTxRes);
      } catch (e) {
        setTxStatus(TxStatus.failed());
        txQueue.current = [];
      }
    };

    if (txQueue.current.length === 0) {
      return;
    } else if (txQueue.current.length === 1) {
      sendExternal();
    } else {
      sendInternal();
    }
  };

  async function buildExtrinsics(transaction, assetMetadata) {
    const postsRaw = await wallet.sign(transaction, assetMetadata);
    const posts = postsRaw.posts;
    const transactions = [];
    for (let i = 0; i < posts.length; i++) {
      const transaction = await mapPostToTransaction(posts[i], api);
      transactions.push(transaction);
    }
    return transactions;
  }

  async function transactionsToBatches(transactions) {
    const MAX_BATCH = 4;
    const batches = [];
    for(let i = 0; i < transactions.length; i += MAX_BATCH) {
      const transactionsInSameBatch = transactions.slice(i, i + MAX_BATCH);
      const batchTransaction = await api.tx.utility.batch(transactionsInSameBatch);
      batches.push(batchTransaction);
    }
    return batches;
  }

  const publishBatchesSequentially = async (transactions, txResHandler) => {
    // Sign batches offline
    const batches = await transactionsToBatches(transactions);

    txQueue.current = batches;
    finalTxResHandler.current = txResHandler;

    try {
      publishNextBatch();
    } catch (e) {
      console.error('Sequential baching failed', e);
      return false;
    }
  };


  const toPublic = async (balance, txResHandler) => {
    await waitForWallet();
    walletIsBusy.current = true;

    // build wasm params
    const value = balance.valueAtomicUnits.toString();
    const assetId = balance.assetType.assetId;
    const txJson = `{ "Reclaim": { "id": ${assetId}, "value": "${value}" }}`;
    const transaction = wasm.Transaction.from_string(txJson);
    const assetMetadataJson = `{ "decimals": ${balance.assetType.numberOfDecimals} , "symbol": "${balance.assetType.ticker}" }`;
    const assetMetadata = wasm.AssetMetadata.from_string(assetMetadataJson);

    const transactions = await buildExtrinsics(transaction, assetMetadata);
    const res = await publishBatchesSequentially(transactions, txResHandler);

    walletIsBusy.current = false;
    console.log(res);
    return res;
  };

  const privateTransfer = async (balance, recipient, txResHandler) => {
    await waitForWallet();
    walletIsBusy.current = true;

    // build wasm params
    const addressJson = privateAddressToJson(recipient);
    const value = balance.valueAtomicUnits.toString();
    const assetId = balance.assetType.assetId;
    const txJson = `{ "PrivateTransfer": [{ "id": ${assetId}, "value": "${value}" }, ${addressJson} ]}`;
    const transaction = wasm.Transaction.from_string(txJson);
    const assetMetadataJson = `{ "decimals": ${balance.assetType.numberOfDecimals} , "symbol": "${balance.assetType.ticker}" }`;
    const assetMetadata = wasm.AssetMetadata.from_string(assetMetadataJson);

    const transactions = await buildExtrinsics(transaction, assetMetadata);
    const res = await publishBatchesSequentially(transactions, txResHandler);

    walletIsBusy.current = false;
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
