import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Form, Grid, Header, Input } from 'semantic-ui-react';
import BN from 'bn.js';
import { loadSpendableAssetsById, loadSpendableAssets, persistSpendableAssets, loadSpendableBalance, removeSpendableAsset } from './utils/persistence/Persistence';
import { useSubstrate } from './substrate-lib';
import TxStatusDisplay from './utils/ui/TxStatusDisplay';
import TxButton from './TxButton';
import { PALLET, CALLABLE } from './constants/ApiConstants';
import TxStatus from './utils/api/TxStatus';
import formatPayloadForSubstrate from './utils/api/FormatPayloadForSubstrate.js';
import MantaAsset from './dtos/MantaAsset';
import { makeTxResHandler } from './utils/api/MakeTxResHandler';



export default function Main ({ fromAccount, mantaKeyring }) {
  const { api } = useSubstrate();
  const [unsub, setUnsub] = useState(null);
  const [status, setStatus] = useState(null);
  const [reclaimPK, setReclaimPK] = useState(null);
  const [assetId, setAssetId] = useState(new BN(-1));
  const [amount, setAmount] = useState(new BN(-1));
  const [insufficientFunds, setInsufficientFunds] = useState(false);
  const [totalBatches, setTotalBatches] = useState(0);


  const currentBatchIdx = useRef(0);
  const coinSelection = useRef(null);
  const changeAmount = useRef(null);
  let asset1 = useRef(null);
  let asset2 = useRef(null);
  const mintZeroCoinAsset = useRef(null);

  /**
   *
   * Orchestration logic
   *
   */

  const doNextReclaim = async () => {
    console.log(coinSelection);
    currentBatchIdx.current += 1;
    setStatus(TxStatus.processing('Generating payload'));
    asset1.current = coinSelection.current.pop();
    asset2.current = coinSelection.current.pop();
    const payload = await generateReclaimPayload();
    submitReclaim(payload);
  };

  const mintZeroCoin = () => {
    currentBatchIdx.current += 1;
    setStatus(TxStatus.processing('Generating payload'));
    const payload = generateMintZeroCoinPayload();
    submitMintZeroCoinTx(payload);
  };

  const forgetAllTransactions = () => {
    asset1.current = null;
    asset2.current = null;
    coinSelection.current = null;
    mintZeroCoinAsset.current = null;
    changeAmount.current = null;
  };

  const selectCoins = useCallback(() => {
    let totalAmount = new BN(0);
    coinSelection.current = [];
    const spendableAssets = loadSpendableAssetsById(assetId);
    spendableAssets.forEach(asset => {
      if (totalAmount.lt(amount) || coinSelection.current.length % 2) {
        totalAmount = totalAmount.add(asset.privInfo.value);
        coinSelection.current.push(asset);
      }
    });
    // If odd number of coins selected, we will have to mint a zero value coin
    const mintBatchesRequired = coinSelection.current.length % 2;
    const transferBatchesRequired = Math.ceil(coinSelection.current.length / 2);
    setTotalBatches(mintBatchesRequired + transferBatchesRequired);
    changeAmount.current = totalAmount.sub(amount);
  }, [assetId, amount]);

  /**
   *
   * Payload gen
   *
   */

  const generateReclaimPayload = async () => {
    let ledgerState1 = await getLedgerState(asset1.current);
    let ledgerState2 = await getLedgerState(asset2.current);
    // flatten (wasm only accepts flat arrays)
    ledgerState1 = Uint8Array.from(ledgerState1.reduce((a, b) => [...a, ...b], []));
    ledgerState2 = Uint8Array.from(ledgerState2.reduce((a, b) => [...a, ...b], []));

    const changeAddress = mantaKeyring.generateNextInternalAddress(assetId);

    const payload = await mantaKeyring.generateReclaimPayload(
      asset1.current.serialize(),
      asset2.current.serialize(),
      ledgerState1,
      ledgerState2,
      asset1.current.privInfo.value.add(asset2.current.privInfo.value.sub(changeAmount.current)),
      reclaimPK,
      changeAddress.serialize()
    );
    return formatPayloadForSubstrate([payload]);
  };

  const generateMintZeroCoinPayload = () => {
    mintZeroCoinAsset.current = mantaKeyring.generateMintAsset(assetId, new BN(0));
    const payload = mantaKeyring.generateMintPayload(mintZeroCoinAsset.current.serialize());
    return formatPayloadForSubstrate([payload]);
  };

  /**
   *
   * polkadot.js API queries / extrinsics
   *
   */

  const submitReclaim = payload => {
    const handleTxResponse = makeTxResHandler(
      api, onReclaimSuccess, onReclaimFailure, onReclaimUpdate);
    const tx = api.tx[PALLET.MANTA_PAY][CALLABLE.MANTA_PAY.RECLAIM](...payload);
    const unsub = tx.signAndSend(fromAccount, handleTxResponse);
    setUnsub(() => unsub);
  };

  const submitMintZeroCoinTx = payload => {
    const handleTxResponse = makeTxResHandler(api, onMintSuccess, onMintFailure, onMintUpdate);
    const tx = api.tx[PALLET.MANTA_PAY][CALLABLE.MANTA_PAY.MINT_PRIVATE_ASSET](...payload);
    const unsub = tx.signAndSend(fromAccount, handleTxResponse);
    setUnsub(() => unsub);
  };

  const getLedgerState = async asset => {
    const shardIndex = asset.utxo[0];
    const shards = await api.query.mantaPay.coinShards();
    return shards.shard[shardIndex].list;
  };

  /**
   *
   * polkadot.js API API response Handlers
   *
   */

  const onReclaimSuccess = async block => {
    removeSpendableAsset(asset1.current);
    removeSpendableAsset(asset2.current);
    // We always make change on the first transaction
    changeAmount.current = new BN(0);

    if (coinSelection.current.length) {
      doNextReclaim();
    } else {
      forgetAllTransactions();
      setStatus(TxStatus.finalized(block));
    }
  };

  const onReclaimFailure = (block, error) => {
    setStatus(TxStatus.failed(block, error));
    forgetAllTransactions();
  };

  const onReclaimUpdate = message => {
    setStatus(TxStatus.processing(message));
  };

  const onMintSuccess = block => {
    coinSelection.current.push(mintZeroCoinAsset.current);
    const spendableAssets = loadSpendableAssets();
    spendableAssets.push(mintZeroCoinAsset.current);
    mintZeroCoinAsset.current = null;
    persistSpendableAssets(spendableAssets);
    doNextReclaim();
  };

  const onMintFailure = (block, error) => {
    setStatus(TxStatus.failed(block, error));
    forgetAllTransactions();
  };

  const onMintUpdate = message => {
    setStatus(TxStatus.processing(message));
  };


  /**
   *
   * On pageload
   *
   */

  useEffect(() => {
    const request = new XMLHttpRequest();
    request.open('GET', 'reclaim_pk.bin', true);
    request.responseType = 'blob';
    request.onreadystatechange = async () => {
      if (request.readyState === 4) {
        const fileContent = request.response;
        const fileContentBuffer = await fileContent.arrayBuffer();
        const reclaimPK = new Uint8Array(fileContentBuffer);
        setReclaimPK(reclaimPK);
      }
    };
    request.send(null);
  }, []);


  /**
   *
   * UI logic
   *
   */

  useEffect(() => {
    if (!amount || !assetId) {
      return;
    }
    if (amount.gt(loadSpendableBalance(assetId))) {
      setInsufficientFunds(true);
    } else {
      selectCoins();
      setInsufficientFunds(false);
    }
  }, [amount, assetId, selectCoins]);

  const handleChangeAssetId = e => {
    const assetId = new BN(e.target.value);
    setAssetId(assetId);
  };

  const onClick = async () => {
    if (coinSelection.current.length % 2 === 1) {
      mintZeroCoin();
    } else {
      doNextReclaim();
    }
  };

  const formIsDisabled = status && status.isProcessing();
  const buttonIsDisabled = (
    formIsDisabled || insufficientFunds || !assetId.gt(new BN(0)) || !amount.gt(new BN(0)));

  return (
    <>
      <Grid.Column width={2}/>
      <Grid.Column width={12}>
        <Header textAlign='center'>Reclaim Private Asset</Header>
        <Form>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              disabled={formIsDisabled}
              label='Asset Id'
              type='number'
              state='assetId'
              onChange={handleChangeAssetId}
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
              onClick={onClick}
              disabled={buttonIsDisabled}
            />
          </Form.Field>
          <TxStatusDisplay
            txStatus={status}
            totalBatches={totalBatches}
            batchNumber={currentBatchIdx.current}
          />
          {
            insufficientFunds && <div style={{ textAlign: 'center', overflowWrap: 'break-word' }}>Insufficient Funds</div>
          }
        </Form>
      </Grid.Column>
      <Grid.Column width={2}/>
    </>
  );
}
