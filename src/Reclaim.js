import React, { useState, useEffect } from 'react';
import { Form, Grid, Header, Input } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';
import { useSubstrate } from './substrate-lib';
import store from 'store';
import MantaAsset from './dtos/MantaAsset';
import { base64Decode } from '@polkadot/util-crypto';



export default function Main ({ accountPair, wasm }) {
  const { api } = useSubstrate();
  const [status, setStatus] = useState(null);
  const [assetPool, setAssetPool] = useState([]);
  const [reclaimPK, setReclaimPK] = useState(null);
  const [formState, setFormState] = useState({ assetId: 0, address: '', amount: 0 });
  const onChange = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: data.value }));
  const { assetId, address, amount } = formState;
  
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

  useEffect(() => {
    const assetsStorage = store.get('manta_utxos') || []; // todo: constant for storage
    console.log(assetsStorage)
    const assets = assetsStorage.map(asset => {
      return new Uint8Array(Object.values(asset));
    });
    setAssetPool(assets);
  }, []);

  const generateReclaimPayload = async () => {
    const getLedgerState = async asset => {
      console.log(asset);
      const shardIndex = new MantaAsset(asset).utxo[0];
      const shards = await api.query.mantaPay.coinShards();
      return shards.shard[shardIndex].list;
    };
    try {
      const selectedAsset1 = assetPool[0];
      const selectedAsset2 = assetPool[1];
      let ledgerState1 = await getLedgerState(selectedAsset1);
      let ledgerState2 = await getLedgerState(selectedAsset2);
      // flatten (wasm only accepts flat arrays)
      ledgerState1 = Uint8Array.from(ledgerState1.reduce((a, b) => [...a, ...b], []));
      ledgerState2 = Uint8Array.from(ledgerState2.reduce((a, b) => [...a, ...b], []));
      // console.log("##########")
      // console.log(selectedAsset1)
      // console.log(ledgerState1)
      // console.log(ledgerState2)
      return wasm.generate_reclaim_payload_for_browser(
        selectedAsset1,
        selectedAsset2,
        ledgerState1,
        ledgerState2,
        amount,
        reclaimPK,
        base64Decode(address.split(' ').join().split('\n').join())
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <>
      <Grid.Column width={2}/>
      <Grid.Column width={12}>
        <Header textAlign='center'>Reclaim Private Asset</Header>
        <Form>
        <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
          <Input
              fluid
              label='Asset Id'
              type='number'
              state='assetId'
              onChange={onChange}
            />
          </Form.Field>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              label='Amount'
              type='number'
              state='amount'
              onChange={onChange}
            />
          </Form.Field>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              label='Address'
              type='string'
              state='address'
              onChange={onChange}
            />
          </Form.Field>
          <Form.Field style={{ textAlign: 'center' }}>
            <TxButton
              accountPair={accountPair}
              label='Submit'
              type='SIGNED-TX'
              setStatus={setStatus}
              attrs={{
                palletRpc: 'mantaPay',
                callable: 'reclaim',
                inputParams: generateReclaimPayload,
                paramFields: [true]
              }}
            />
          </Form.Field>
          <div style={{ overflowWrap: 'break-word' }}>{status && status.toString()}</div>
        </Form>
      </Grid.Column>
      <Grid.Column width={2}/>
    </>
  );
}
