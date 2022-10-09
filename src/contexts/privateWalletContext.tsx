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
import Api, { ApiConfig } from 'manta-wasm-wallet-api';
import config from 'config';
import * as axios from 'axios';
import { base58Decode, base58Encode } from '@polkadot/util-crypto';
import TxStatus from 'types/TxStatus';
import mapPostToTransaction from 'utils/api/MapPostToTransaction';
import { useExternalAccount } from './externalAccountContext';
import { useSubstrate } from './substrateContext';
import { useTxStatus } from './txStatusContext';
import { network } from '../constants/NetworkConstants';

const PrivateWalletContext = createContext();

const DolphinNetwork = network.dolphin;
//const CalamariNetwork = network.calamari;
//const MantaNetwork = network.manta;

export const PrivateWalletContextProvider = (props) => {
  // external contexts
  const { api, socket } = useSubstrate();
  const { externalAccountSigner } = useExternalAccount();
  const { setTxStatus, txStatusRef } = useTxStatus();

  // wasm wallet
  const [privateAddress, setPrivateAddress] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [wasm, setWasm] = useState(null);
  const [wasmApi, setWasmApi] = useState(null);

  // signer connection
  const [signerIsConnected, setSignerIsConnected] = useState(null);
  const [signerVersion, setSignerVersion] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isInitialSync, setIsInitialSync] = useState(false);
  const walletIsBusy = useRef(false);

  // transaction state
  const txQueue = useRef([]);
  const finalTxResHandler = useRef(null);
  const balancesAreStale = useRef(false);

  // current network - currently hardcoded as Dolphin
  // @TODO: Link this with the correct currently selected network.
  // @TODO: Add useEffect() to call initWallet() upon change in network.
  const [currentNetwork, _setCurrentNetwork] = useState(DolphinNetwork);

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
      const keys = await wallet.receiving_keys(
        new wasm.ReceivingKeyRequest('GetAll')
      );
      const privateAddressRaw = keys[0];
      const privateAddressBytes = [
        ...privateAddressRaw.spend,
        ...privateAddressRaw.view
      ];
      return base58Encode(privateAddressBytes);
    };

    const canInitWallet = () => {
      return api && externalAccountSigner && signerIsConnected;
    };

    const initWallet = async () => {
      console.log('INITIALIZING WALLET');
      setIsInitialSync(true);
      walletIsBusy.current = false;
      await api.isReady;
      const wasm = await import('manta-wasm-wallet');
      const wasmSigner = new wasm.Signer(config.SIGNER_URL);
      const DEFAULT_PULL_SIZE = 4096;
      const wasmApiConfig = new ApiConfig(
        api, externalAccountSigner, DEFAULT_PULL_SIZE, DEFAULT_PULL_SIZE
      );
      const wasmApi = new Api(wasmApiConfig);
      const wasmLedger = new wasm.PolkadotJsLedger(wasmApi);
      const wasmWallet = new wasm.Wallet(wasmLedger, wasmSigner);
      const privateAddress = await getPrivateAddress(wasm, wasmWallet);
      const networkType = wasm.NetworkType.from_string(`"${currentNetwork}"`);
      setPrivateAddress(privateAddress);
      console.log('Beginning initial sync');
      const startTime = performance.now();
      await wasmWallet.restart(networkType);
      const endTime = performance.now();
      console.log(
        `Initial sync finished in ${(endTime - startTime) / 1000} seconds`
      );
      setWasm(wasm);
      setWasmApi(wasmApi);
      setWallet(wasmWallet);
      setIsInitialSync(false);
    };

    if (canInitWallet() && !isReady) {
      initWallet();
    }
  }, [api, externalAccountSigner, signerIsConnected]);

  const fetchSignerVersion = async () => {
    try {
      const res = await axios.get(`${config.SIGNER_URL}version`, {
        timeout: 1500
      });
      const signerVersion = res.data;
      const signerIsConnected = !!signerVersion;
      setSignerIsConnected(signerIsConnected);
      if (signerIsConnected) {
        setSignerVersion(new Version(signerVersion));
      } else {
        setSignerIsConnected(signerIsConnected);
        setSignerVersion(null);
        setWasm(null);
        setPrivateAddress(null);
        setWasmApi(null);
        setWallet(null);
      }
    } catch (err) {
      setSignerIsConnected(false);
      setSignerVersion(null);
      setWasm(null);
      setPrivateAddress(null);
      setWasmApi(null);
      setWallet(null);
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
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  const sync = async () => {
    // Don't refresh while wallet is busy to avoid panics in manta-wasm-wallet;
    // Don't refresh during a transaction to prevent stale balance updates
    // from being applied after the transaction is finished
    if (walletIsBusy.current === true || txStatusRef.current?.isProcessing()) {
      return;
    }
    walletIsBusy.current = true;
    try {
      console.log('Beginning sync');
      const startTime = performance.now();
      const networkType = wasm.NetworkType.from_string(`"${currentNetwork}"`);
      await wallet.sync(networkType);
      const endTime = performance.now();
      console.log(`Sync finished in ${(endTime - startTime) / 1000} seconds`);
      balancesAreStale.current = false;
    } catch (error) {
      console.error('Sync failed', error);
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
    if (!isReady || balancesAreStale.current) {
      return null;
    }
    await waitForWallet();
    const balanceRaw = wallet.balance(new wasm.AssetId(assetType.assetId));
    return new Balance(assetType, new BN(balanceRaw));
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
        await lastTx.signAndSend(
          externalAccountSigner,
          finalTxResHandler.current
        );
      } catch (e) {
        setTxStatus(TxStatus.failed());
        txQueue.current = [];
      }
    };

    const sendInternal = async () => {
      try {
        const internalTx = txQueue.current.shift();
        await internalTx.signAndSend(
          externalAccountSigner,
          handleInternalTxRes
        );
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

  const convertToOldPost = (post) => {
    // need to iterate over all receiverPosts and convert EncryptedNote from new
    // format of EncryptedNote { header: (), Ciphertext {...} } to old format:
    // EncryptedNote { ephermeral_public_key: [], ciphertext: [] }

    let postCopy = JSON.parse(JSON.stringify(post));
    postCopy.receiver_posts.map(x => {x.encrypted_note = x.encrypted_note.ciphertext});
    return postCopy
  }

  async function buildExtrinsics(transaction, assetMetadata, networkType) {
    const posts = await wallet.sign(transaction, assetMetadata, networkType);
    const transactions = [];
    for (let i = 0; i < posts.length; i++) {
      let convertedPost = convertToOldPost(posts[i]);
      const transaction = await mapPostToTransaction(convertedPost, api);
      transactions.push(transaction);
    }
    return transactions;
  }

  async function transactionsToBatches(transactions) {
    const MAX_BATCH = 2;
    const batches = [];
    for (let i = 0; i < transactions.length; i += MAX_BATCH) {
      const transactionsInSameBatch = transactions.slice(i, i + MAX_BATCH);
      const batchTransaction = await api.tx.utility.batch(
        transactionsInSameBatch
      );
      batches.push(batchTransaction);
    }
    return batches;
  }

  const publishBatchesSequentially = async (transactions, txResHandler) => {
    const batches = await transactionsToBatches(transactions);

    txQueue.current = batches;
    finalTxResHandler.current = txResHandler;

    try {
      publishNextBatch();
      return true;
    } catch (e) {
      console.error('Sequential baching failed', e);
      return false;
    }
  };

  const toPublic = async (balance, txResHandler, network=currentNetwork) => {
    // build wasm params
    const value = balance.valueAtomicUnits.toString();
    const assetId = balance.assetType.assetId;
    const txJson = `{ "Reclaim": { "id": ${assetId}, "value": "${value}" }}`;
    const transaction = wasm.Transaction.from_string(txJson);
    const assetMetadataJson = `{ "decimals": ${balance.assetType.numberOfDecimals} , "symbol": "${balance.assetType.ticker}" }`;
    const assetMetadata = wasm.AssetMetadata.from_string(assetMetadataJson);
    const networkType = wasm.NetworkType.from_string(`"${network}"`);

    try {
      await waitForWallet();
      walletIsBusy.current = true;
      const transactions = await buildExtrinsics(transaction, assetMetadata, networkType);
      walletIsBusy.current = false;
      const res = await publishBatchesSequentially(transactions, txResHandler);
      return res;
    } catch (error) {
      console.error('Transaction failed', error);
      walletIsBusy.current = false;
      return false;
    }
  };

  const privateTransfer = async (balance, recipient, txResHandler, network=currentNetwork) => {
    // build wasm params
    const addressJson = privateAddressToJson(recipient);
    const value = balance.valueAtomicUnits.toString();
    const assetId = balance.assetType.assetId;
    const txJson = `{ "PrivateTransfer": [{ "id": ${assetId}, "value": "${value}" }, ${addressJson} ]}`;
    const transaction = wasm.Transaction.from_string(txJson);
    const assetMetadataJson = `{ "decimals": ${balance.assetType.numberOfDecimals} , "symbol": "${balance.assetType.ticker}" }`;
    const assetMetadata = wasm.AssetMetadata.from_string(assetMetadataJson);;
    const networkType = wasm.NetworkType.from_string(`"${network}"`);

    try {
      await waitForWallet();
      walletIsBusy.current = true;
      const transactions = await buildExtrinsics(transaction, assetMetadata, networkType);
      walletIsBusy.current = false;
      const res = await publishBatchesSequentially(transactions, txResHandler);
      return res;
    } catch (error) {
      console.error('Transaction failed', error);
      walletIsBusy.current = false;
      return false;
    }
  };

  const toPrivate = async (balance, txResHandler, network=currentNetwork) => {
    await waitForWallet();
    walletIsBusy.current = true;
    const value = balance.valueAtomicUnits.toString();
    const assetId = balance.assetType.assetId;
    const txJson = `{ "Mint": { "id": ${assetId}, "value": "${value}" }}`;
    const transaction = wasm.Transaction.from_string(txJson);
    const networkType = wasm.NetworkType.from_string(`"${network}"`);
    wasmApi.txResHandler = txResHandler;
    wasmApi.externalAccountSigner = externalAccountSigner;
    try {
      const res = await wallet.post(transaction, null, networkType);
      walletIsBusy.current = false;
      return res;
    } catch (error) {
      console.error('Transaction failed', error);
      walletIsBusy.current = false;
      return false;
    }
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
    isInitialSync,
    walletIsBusy,
    balancesAreStale
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