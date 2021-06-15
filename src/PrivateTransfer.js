import React, { useState, useEffect } from 'react';
import { Form, Grid, Header, Input } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';
import { useSubstrate } from './substrate-lib';
import store from 'store';
import { base64Decode } from '@polkadot/util-crypto';
import MantaAsset from './dtos/MantaAsset';

export default function Main ({ accountPair, wasm }) {
  // todo: generate new private keys and save in local storage / remove hardcoded keys
  // todo: remove secret keys from Manta asset type / use manta asset type everywhere
  // todo: make amount configurable / coin selection / change
  // todo: get rid of spent utxos
  // todo: consistnet naming of assets / utxos
  // todo: handle statuses as constants

  const { api } = useSubstrate();
  const [status, setStatus] = useState(null);
  const [utxoPool, setUtxoPool] = useState([]);
  const [transferPK, setTransferPK] = useState(null);
  const [formState, setFormState] = useState(
    { address1: null, address2: null, amount: 0, assetId: null });
  const onChange = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: data.value }));
  const { address1, address2, amount, assetId } = formState;

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

  useEffect(() => {
    const assetsStorage = store.get('manta_utxos') || []; // todo: constant for storage
    const assets = assetsStorage.map(utxo => {
      return new Uint8Array(Object.values(utxo));
    });
    setUtxoPool(assets);
  }, []);

  const generateTransferPayload = async () => {
    const getLedgerState = async asset => {
      console.log(asset);
      const shardIndex = new MantaAsset(asset).utxo[0];
      const shards = await api.query.mantaPay.coinShards();
      return shards.shard[shardIndex].list;
    };
    try {
      const selectedUtxo1 = utxoPool[0];
      const selectedUtxo2 = utxoPool[1];
      let ledgerState1 = await getLedgerState(selectedUtxo1);
      let ledgerState2 = await getLedgerState(selectedUtxo2);
      // flatten (wasm only accepts flat arrays)
      ledgerState1 = Uint8Array.from(ledgerState1.reduce((a, b) => [...a, ...b], []));
      ledgerState2 = Uint8Array.from(ledgerState2.reduce((a, b) => [...a, ...b], []));
      return wasm.generate_private_transfer_payload_for_browser(
        selectedUtxo1,
        selectedUtxo2,
        ledgerState1,
        ledgerState2,
        transferPK,
        base64Decode(address1.split(' ').join().split('\n').join()),
        base64Decode(address2.split(' ').join().split('\n').join())
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <>
      <Grid.Column width={2}/>
      <Grid.Column width={12} textAlign='center'>
        <Header textAlign='center'>Private Transfer</Header>
        <Form>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              label='Asset ID'
              type='number'
              state='assetId'
              onChange={onChange}
            />
          </Form.Field>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              label='Address 1'
              type='string'
              state='address1'
              onChange={onChange}
            />
          </Form.Field>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              label='Address 2'
              type='string'
              state='address2'
              onChange={onChange}
            />
          </Form.Field>
          {/* <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              label='Amount'
              type='number'
              state='amount'
              onChange={onChange}
            />
          </Form.Field> */}
          <Form.Field style={{ textAlign: 'center' }}>
            <TxButton
              accountPair={accountPair}
              label='Submit'
              type='SIGNED-TX'
              setStatus={setStatus}
              attrs={{
                palletRpc: 'mantaPay',
                callable: 'privateTransfer',
                inputParams: assetId && address1 && address2 ? generateTransferPayload : [null],
                paramFields: [true]
              }}
            />
          </Form.Field>
          <div style={{ overflowWrap: 'break-word' }}>{status}</div>
        </Form>
      </Grid.Column>
      <Grid.Column width={2}/>
    </>
  );
}
