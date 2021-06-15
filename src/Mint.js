import React, { useState, useEffect } from 'react';
import { Form, Grid, Header, Input } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';
import { base64Encode } from '@polkadot/util-crypto';
import BN from 'bn.js';
import store from 'store';
import { useCompare } from './utils/UseCompare';
import MantaAsset from './dtos/MantaAsset';

export default function Main ({ accountPair, wasm }) {
  const [status, setStatus] = useState('');
  const [formState, setFormState] = useState({ assetID: null, mintAmount: 0 });
  const onChange = (_, data) => {
    setFormState(prev => ({ ...prev, [data.state]: data.value }));
  };
  const [asset, setAsset] = useState(null);
  const [mintInfo, setMintInfo] = useState(null);
  const { assetID, mintAmount } = formState;
  const [pendingTransaction, setPendingTransaction] = useState(false);



  // Update UTXO cache in localStorage after transaction finalized
  const statusHasChanged = useCompare(status);
  useEffect(() => {
    if (statusHasChanged && status.includes('😉 Finalized')) { // todo: use constant here
      const utxos = store.get('manta_utxos') || []; // todo: constant for storage
      utxos.push(asset);
      store.set('manta_utxos', utxos);
      console.log(store.get('manta_utxos'));
    }
  }, [statusHasChanged, asset, status]);

  // Set pending transaction
  useEffect(() => {
    setPendingTransaction(
      status && !status.includes('😉 Finalized') && !status.includes('Transaction failed'));
  }, [status]);

  // Update asset and mint payload on form change
  useEffect(() => {
    if (!pendingTransaction && assetID && mintAmount) {
      try {
        const asset = wasm.generate_asset_for_browser(new Uint8Array(32).fill(0), assetID, mintAmount);
        const mintPayload = wasm.generate_mint_payload_for_browser(asset);
        setAsset(asset);
        setMintInfo(mintPayload);
      } catch (error) {
        console.log(error);
      }
    }
  }, [assetID, mintAmount, pendingTransaction, wasm]);

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
              state='assetID'
              onChange={onChange}
              disabled={pendingTransaction}
            />
          </Form.Field>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              label='Amount'
              type='number'
              state='mintAmount'
              onChange={onChange}
              disabled={pendingTransaction}
            />
          </Form.Field>
            <Form.Field style={{ textAlign: 'center' }}>
              <TxButton
                disabled={pendingTransaction}
                accountPair={accountPair}
                label='Submit'
                type='SIGNED-TX'
                setStatus={setStatus}
                attrs={{
                  palletRpc: 'mantaPay',
                  callable: 'mintPrivateAsset',
                  inputParams: [mintInfo],
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
