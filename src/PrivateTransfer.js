import React, { useState, useEffect, useRef, useCallback } from 'react';
import TxButton from './TxButton';
import { Form, Grid, Header, Input } from 'semantic-ui-react';
import { useSubstrate } from './substrate-lib';
import { base64Decode } from '@polkadot/util-crypto';
import _ from 'lodash';
import { loadSpendableAssetsById, loadSpendableAssets, persistSpendableAssets, loadSpendableBalances } from './utils/Persistence';
import BN from 'bn.js';
import TxStatus from './utils/api/TxStatus';
import formatPayloadForSubstrate from './utils/api/FormatPayloadForSubstrate.js';
import { makeTxResHandler } from './utils/api/MakeTxResHandler';
import TxStatusDisplay from './utils/ui/TxStatusDisplay';

export default function Main ({ fromAccount, wasm }) {
  // now
  // todo: mint if odd number
  // todo: only send change on last batch
  // todo: actually derive change address
  // todo: sort imports
  // todo: error on switch signer

  // later
  // form validaion component
  // todo: fix memory leak / pages shouldn't reset on switching labs page
  // todo: automatically generate proving keys on startup
  // todo: check that coins actually exist on startup (maybe they were spent on different computer)
  // todo: error types
  // todo: ledger state dto
  // todo: store pending spends
  // todo: generate new private keys and save in local storage / remove hardcoded keys
  // todo: poll assets we have received
  // todo: cleanup folder structure
  // todo: address derivation / change
  // todo: intelligent coin selection

  const PALLET_RPC = 'mantaPay';
  const CALLABLE = 'privateTransfer';

  const { api } = useSubstrate();
  const [unsub, setUnsub] = useState(null);
  const [status, setStatus] = useState(null);
  const [transferPK, setTransferPK] = useState(null);
  const [address, setAddress] = useState(null);
  const [amount, setAmount] = useState(null);
  const [assetId, setAssetId] = useState(null);
  const [changeAmount, setChangeAmount] = useState(null);
  const [insufficientFunds, setInsufficientFunds] = useState(false);
  const [currentBatchIdx, setCurrentBatchIdx] = useState(null);
  const [totalBatches, setTotalBatches] = useState(null);

  const coinSelection = useRef(null);
  const payload = useRef(null);
  const asset1 = useRef(null);
  const asset2 = useRef(null);

  const changeAddress = 'AQAAAAAAAAD0FiyOjReKzSPDATglAwsTAbwiH4lDA+cP6XwnfOiuHTCSrcEZoumvlG4loFTyimDlKFh8vwvrSHHTGWyJWwoKfPA+T9/RVA/xvCPBuAM5HGujQOJpIuaX50FQzhGl7wQClRVMwrkPy93Gal9Gm5vPu7561QZhKRP+nF+MKhYfaw==';

  // Load transfer proving key
  useEffect(() => {
    const request = new XMLHttpRequest();
    request.open('GET', 'transfer_pk.bin', true);
    request.responseType = 'blob';
    request.onreadystatechange = async () => {
      if (request.readyState === 4) {
        const fileContent = request.response;
        const fileContentBuffer = await fileContent.arrayBuffer();
        const transferPK = new Uint8Array(fileContentBuffer);
        setTransferPK(transferPK);
      }
    };
    request.send(null);
  }, []);

  const selectCoins = useCallback(() => {
    let totalAmount = new BN(0);
    coinSelection.current = [];
    const spendableAssets = loadSpendableAssetsById(assetId);
    spendableAssets.forEach(asset => {
      if (totalAmount.lt(amount) || coinSelection.current.length % 2 === 1) {
        totalAmount = totalAmount.add(asset.privInfo.value);
        coinSelection.current.push(asset);
      }
    });
    if (coinSelection.current.length % 2 !== 0) {
      throw new Error('Odd number of coins selected');
    }
    setTotalBatches(coinSelection.current.length / 2);
    setChangeAmount(totalAmount.sub(amount));
  }, [assetId, amount]);

  // Insufficient funds form validation
  useEffect(() => {
    if (!amount || !assetId) {
      return;
    }
    const spendableBalance = loadSpendableBalances()[assetId.toNumber()] || new BN(0);
    if (amount.gt(spendableBalance)) {
      setInsufficientFunds(true);
    } else {
      selectCoins();
      setInsufficientFunds(false);
    }
  }, [amount, assetId, selectCoins]);

  const getLedgerState = async asset => {
    const shardIndex = asset.utxo[0];
    const shards = await api.query.mantaPay.coinShards();
    return shards.shard[shardIndex].list;
  };

  const generatePrivateTransferPayload = async () => {
    let ledgerState1 = await getLedgerState(asset1.current);
    let ledgerState2 = await getLedgerState(asset2.current);
    // flatten (wasm only accepts flat arrays)
    ledgerState1 = Uint8Array.from(ledgerState1.reduce((a, b) => [...a, ...b], []));
    ledgerState2 = Uint8Array.from(ledgerState2.reduce((a, b) => [...a, ...b], []));

    const payload = await wasm.generate_private_transfer_payload_for_browser(
      asset1.current.serialize(),
      asset2.current.serialize(),
      ledgerState1,
      ledgerState2,
      transferPK,
      base64Decode(address.trim()),
      base64Decode(changeAddress),
      asset1.current.privInfo.value,
      asset2.current.privInfo.value
    );
    return formatPayloadForSubstrate([payload]);
  };

  const onTxSuccess = async block => {
    // Remove spent assets from browser storage
    const spendableAssets = loadSpendableAssets()
      .filter(asset => !_.isEqual(asset, asset1.current) && !_.isEqual(asset, asset2.current));
    persistSpendableAssets(spendableAssets);

    if (coinSelection.current.length) {
      setCurrentBatchIdx(currentBatchIdx + 1);
      asset1.current = coinSelection.current.pop();
      asset2.current = coinSelection.current.pop();
      payload.current = await generatePrivateTransferPayload();
      submitTransaction(payload.current);
    } else {
      asset1.current = null;
      asset2.current = null;
      payload.current = null;
      coinSelection.current = null;
      setChangeAmount(null);
      setStatus(TxStatus.finalized(block));
    }
  };

  const onTxFailure = (block, error) => {
    asset1.current = null;
    asset2.current = null;
    payload.current = null;
    coinSelection.current = null;
    setChangeAmount(null);
    setStatus(TxStatus.failed(block, error));
  };

  const onTxUpdate = message => {
    setStatus(TxStatus.processing(message));
  };

  const submitTransaction = payload => {
    const handleTxResponse = makeTxResHandler(api, onTxSuccess, onTxFailure, onTxUpdate);
    const tx = api.tx[PALLET_RPC][CALLABLE](...payload);
    const unsub = tx.signAndSend(fromAccount, handleTxResponse);
    setUnsub(() => unsub);
  };

  const onClickSubmit = async () => {
    setCurrentBatchIdx(1);
    setStatus(TxStatus.processing('Generating payload'));

    asset1.current = coinSelection.current.pop();
    asset2.current = coinSelection.current.pop();
    payload.current = await generatePrivateTransferPayload();
    submitTransaction(payload.current);
  };

  const formIsDisabled = status && status.isProcessing();
  const buttonIsDisabled = formIsDisabled || insufficientFunds || !address || !assetId;

  return (
    <>
      <Grid.Column width={2}/>
      <Grid.Column width={12} textAlign='center'>
        <Header textAlign='center'>Private Transfer</Header>
        <Form>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              disabled={formIsDisabled}
              label='Asset ID'
              type='number'
              state='assetId'
              onChange={e => setAssetId(new BN(e.target.value))}
            />
          </Form.Field>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              disabled={formIsDisabled}
              label='Address'
              type='string'
              state='address'
              onChange={e => setAddress(e.target.value)}
            />
          </Form.Field>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              disabled={formIsDisabled}
              label='Amount'
              type='number'
              state='amount'
              onChange={e => setAmount(new BN(e.target.value))}
            />
          </Form.Field>
          <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label='Submit'
            onClick={onClickSubmit}
            disabled={buttonIsDisabled}
          />
          </Form.Field>
          <TxStatusDisplay
            txStatus={status}
            totalBatches={totalBatches}
            batchNumber={currentBatchIdx}
          />
        </Form>
      </Grid.Column>
      <Grid.Column width={2}/>
    </>
  );
}
