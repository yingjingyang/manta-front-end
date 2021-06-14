import React, { useState, useEffect } from 'react';
import { Form, Grid, Header, Input } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';
import { useSubstrate } from './substrate-lib';

export default function Main ({ accountPair }) {
  const { api } = useSubstrate();
  const [wasm, setWasm] = useState(null);
  const [status, setStatus] = useState(null);
  const [transferPayload, setTransferPayload] = useState(null);
  const [transferPK, setTransferPK] = useState(null);
  const [formState, setFormState] = useState(
    { address: null, amount: 0, assetID: null });
  const onChange = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: data.value }));
  const { address, amount, assetID } = formState;

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
    async function loadWasm () {
      const wasm = await import('manta-api');
      wasm.init_panic_hook();
      setWasm(wasm);
    }
    loadWasm();
  }, []);

  useEffect(() => {
    async function generateTransferPayload() {
      if (amount && address && assetID && transferPK && wasm) {
        try {
          let ledgerState = await api.query.mantaPay.coinShards();
          //.shard.flatmap(x => Uint8Array(x));
          ledgerState = ledgerState['shard'];
          console.log(ledgerState);
          // .flatmap(shard => Uint8Array(shard['root']))
          const transferPayload = wasm.generate_private_transfer_payload_for_browser(
            assetID,
            amount,
            new Uint8Array(32).fill(0),
            transferPK,
            address,
            address,
            ledgerState
          );
          console.log('transferPayload', transferPayload);
          setTransferPayload(transferPayload);
        } catch (error) {
          console.log(error);
        }
      }
    }
    generateTransferPayload();
  }, [amount, address, wasm, assetID, transferPK, api]);

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
              state='assetID'
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
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              label='Amount'
              type='number'
              state='amount'
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
                callable: 'privateTransfer',
                inputParams: [transferPayload],
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
