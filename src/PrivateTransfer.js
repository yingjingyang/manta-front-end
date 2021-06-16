import React, { useState, useEffect } from 'react';
import { Form, Grid, Header, Input } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';
import { useSubstrate } from './substrate-lib';
import store from 'store';
import { base64Decode } from '@polkadot/util-crypto';
import MantaAsset from './dtos/MantaAsset';

export default function Main ({ accountPair, wasm }) {
  // todo: can't mint twice in a row / standardize form 'freezing'
  // todo:  // todo: constant for storage
  // todo: debug strange void number behavior
  // todo: generate new private keys and save in local storage / remove hardcoded keys
  // todo: remove secret keys from Manta asset type / use manta asset type everywhere
  // todo: get rid of spent utxos
  // todo: make amount configurable / coin selection / change (HARD)

  const { api } = useSubstrate();
  const [status, setStatus] = useState(null);
  const [assetPool, setAssetPool] = useState([]);
  const [transferPK, setTransferPK] = useState(null);
  const [formState, setFormState] = useState(
    { address1: '', 
      address2: '', 
      amount: 0, 
      assetId: null });
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
    console.log(assetsStorage)
    const assets = assetsStorage.map(asset => {
      return new Uint8Array(Object.values(asset));
    });
    setassetPool(assets);
  }, []);

  const generateTransferPayload = async () => {
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
      return wasm.generate_private_transfer_payload_for_browser(
        selectedAsset1,
        selectedAsset2,
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
              value={'AQAAAAAAAAAJy/f40VkqJB3oAkaWQuTHY6+ZUYU3obSc8Ukgjh/UazXERJtLA/s70crzd6HNBZmIZdd63d7LFkJQcb4FgXQI0XgBihbzlG9aau2s1nO216m7N8vRMh6S7QdWhv+sTARp5QTDsmJ3w/iUeoKurPoz0Y9Gf+94tAGzswzefvB8Sw=='}
            />
          </Form.Field>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              label='Address 2'
              type='string'
              state='address2'
              onChange={onChange}
              value={'AQAAAAAAAACuWdBEJUh3RKmXOjdmRMpFrWK0Krw5q4SIdpj8/r3JjIhtGSmH5mv2pkHbLm3MJdJghZPcYR2jf3wUkuwVVKIDHYb5/3k51FUKzQrIcW9bxcmnYxm2x/3sFH64Ivp/SgEwPkeLk7C3vBAwi9267NPv9W1AIxrgTgQacQgaij6VWg=='}
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
          <div style={{ overflowWrap: 'break-word' }}>{status && status.toString()}</div>
        </Form>
      </Grid.Column>
      <Grid.Column width={2}/>
    </>
  );
}
