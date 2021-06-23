import React, { useState, useEffect, useRef } from 'react';
import { Form, Grid, Header, Input } from 'semantic-ui-react';
import { useSubstrate } from './substrate-lib';
import { base64Decode } from '@polkadot/util-crypto';
import { loadSpendableAssets, loadSpendableAssetsById, persistSpendableAssets } from './utils/Persistence';
import _ from 'lodash';
import BN from 'bn.js';


export default function Main ({ fromAccount, wasm }) {
  const { api } = useSubstrate();
  const [status, setStatus] = useState(null);
  const [reclaimPK, setReclaimPK] = useState(null);
  const [assetId, setAssetId] = useState(null);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState(null);

  let selectedAsset1 = useRef(null);
  let selectedAsset2 = useRef(null);

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

  const getLedgerState = async asset => {
    const shardIndex = asset.utxo[0];
    const shards = await api.query.mantaPay.coinShards();
    return shards.shard[shardIndex].list;
  };

  const generateReclaimPayload = async () => {
    const spendableAssets = loadSpendableAssetsById(assetId);
    const selectedAsset1 = spendableAssets[0];
    const selectedAsset2 = spendableAssets[1];
    let ledgerState1 = await getLedgerState(selectedAsset1);
    let ledgerState2 = await getLedgerState(selectedAsset2);
    // flatten (wasm only accepts flat arrays)
    ledgerState1 = Uint8Array.from(ledgerState1.reduce((a, b) => [...a, ...b], []));
    ledgerState2 = Uint8Array.from(ledgerState2.reduce((a, b) => [...a, ...b], []));

    // console.log(
    //   selectedAsset1.serialize(),
    //   selectedAsset2.serialize(),
    //   ledgerState1,
    //   ledgerState2,
    //   amount,
    //   reclaimPK,
    //   base64Decode(address.trim())
    // );

    return wasm.generate_reclaim_payload_for_browser(
      selectedAsset1.serialize(),
      selectedAsset2.serialize(),
      ledgerState1,
      ledgerState2,
      amount,
      reclaimPK,
      base64Decode(address.trim())
    );
  };

  const onReclaimSuccess = () => {
    const spendableAssets = loadSpendableAssets()
      .filter(asset => !_.isEqual(asset, selectedAsset1) && !_.isEqual(asset, selectedAsset2));
    persistSpendableAssets(spendableAssets);
    selectedAsset1 = null;
    selectedAsset2 = null;
  };

  const onReclaimFailure = () => {
    selectedAsset1 = null;
    selectedAsset2 = null;
  };

  const formDisabled = status && status.isProcessing();

  const buttonDisabled = (
    (status && status.isProcessing()) || !assetId || !address || !amount
  );

  return (
    <>
      <Grid.Column width={2}/>
      <Grid.Column width={12}>
        <Header textAlign='center'>Reclaim Private Asset</Header>
        <Form>
        <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
          <Input
              fluid
              disabled={formDisabled}
              label='Asset Id'
              type='number'
              state='assetId'
              onChange={e => setAssetId(new BN(e.target.value))}
            />
          </Form.Field>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              disabled={formDisabled}
              label='Address'
              type='string'
              state='address'
              onChange={e => setAddress(e.target.value)}
            />
          </Form.Field>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              disabled={formDisabled}
              label='Amount'
              type='number'
              state='amount'
              onChange={e => setAmount(new BN(e.target.value))}
            />
          </Form.Field>
          {/* <Form.Field style={{ textAlign: 'center' }}>
            <TxButton
              accountPair={accountPair}
              label='Submit'
              type='SIGNED-TX'
              setStatus={setStatus}
              disabled={buttonDisabled}
              attrs={{
                palletRpc: 'mantaPay',
                callable: 'reclaim',
                payloads: [generateReclaimPayload],
                onSuccess: onReclaimSuccess,
                onFailure: onReclaimFailure
              }}
            />
          </Form.Field> */}
          <div style={{ overflowWrap: 'break-word' }}>{status && status.toString()}</div>
        </Form>
      </Grid.Column>
      <Grid.Column width={2}/>
    </>
  );
}
