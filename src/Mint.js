import React, { useState, useRef } from 'react';
import { Form, Grid, Header, Input } from 'semantic-ui-react';
import TxButton from './TxButton';
import formatPayloadForSubstrate from './utils/api/FormatPayloadForSubstrate.js';
import BN from 'bn.js';
import { useSubstrate } from './substrate-lib';
import { loadSpendableAssets, persistSpendableAssets } from './utils/Persistence';
import TxStatus from './utils/api/TxStatus';
import { makeTxResHandler } from './utils/api/MakeTxResHandler';
import TxStatusDisplay from './utils/ui/TxStatusDisplay';

import MantaAsset from './dtos/MantaAsset';

export default function Main ({ fromAccount, wasm }) {
  const PALLET_RPC = 'mantaPay';
  const CALLABLE = 'mintPrivateAsset';

  const { api } = useSubstrate();
  const [unsub, setUnsub] = useState(null);
  const [status, setStatus] = useState(null);
  const [assetId, setAssetId] = useState(null);
  const [mintAmount, setMintAmount] = useState(null);
  const [currentBatchIdx, setCurrentBatchIdx] = useState(null);
  const [totalBatches, setTotalBatches] = useState(null);

  let assetQueue = useRef(null);
  let payloadQueue = useRef(null);

  const generateMintPayload = mintAmount => {
    const mintAsset = new MantaAsset(
      wasm.generate_asset_for_browser(
        new Uint8Array(32).fill(0), new BN(assetId), new BN(mintAmount)
      )
    );
    const mintInfo = wasm.generate_mint_payload_for_browser(mintAsset.serialize());
    return [formatPayloadForSubstrate([mintInfo]), mintAsset];
  };

  const onTxSuccess = block => {
    const spendableAssets = loadSpendableAssets();
    spendableAssets.push(assetQueue.pop());
    persistSpendableAssets(spendableAssets);

    if (payloadQueue.length) {
      setCurrentBatchIdx(2);
      submitTransaction(payloadQueue.pop());
    } else {
      payloadQueue = null;
      assetQueue = null;
      setStatus(TxStatus.finalized(block));
    }
  };

  const onTxFailure = (block, error) => {
    payloadQueue = null;
    assetQueue = null;
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

  const onClickSubmit = () => {
    // mint two assets so that we always have at least two private tokens to spend
    // todo: this is not a long term solution; when we receiver assets, might only have 1 token
    setCurrentBatchIdx(1);
    const smallerHalf = mintAmount.div(new BN(2));
    const largerHalf = mintAmount.sub(smallerHalf);
    payloadQueue = [];
    assetQueue = [];
    for (const amount of [smallerHalf, largerHalf]) {
      if (amount.gt(new BN(0))) {
        const [payload, asset] = generateMintPayload(amount);
        payloadQueue.push(payload);
        assetQueue.push(asset);
      }
    }
    setTotalBatches(payloadQueue.length);
    submitTransaction(payloadQueue.pop());
  };

  const formIsDisabled = status && status.isProcessing();
  const buttonIsDisabled = formIsDisabled || !assetId || !mintAmount;

  return (
    <>
      <Grid.Column width={2}/>
      <Grid.Column width={10}>
        <Header textAlign='center'>Mint Private Asset</Header>
        <Form>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              label='Asset ID'
              type='number'
              state='assetId'
              onChange={e => setAssetId(new BN(e.target.value))}
              disabled={formIsDisabled}
            />
          </Form.Field>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              label='Amount'
              type='number'
              state='mintAmount'
              onChange={e => setMintAmount(new BN(e.target.value))}
              disabled={formIsDisabled}
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
