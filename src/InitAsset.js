import React, { useState } from 'react';
import { Form, Grid, Header, Input } from 'semantic-ui-react';
import TxButton from './TxButton';
import formatPayloadForSubstrate from './utils/api/FormatPayloadForSubstrate.js';
import { useSubstrate } from './substrate-lib';
import { makeDefaultTxResHandler } from './utils/api/MakeTxResHandler';
import BN from 'bn.js';

export default function Main ({ fromAccount }) {
  const PALLET_RPC = 'mantaPay';
  const CALLABLE = 'initAsset';

  const { api } = useSubstrate();
  const [unsub, setUnsub] = useState(null);
  const [status, setStatus] = useState(null);
  const [assetId, setAssetId] = useState(null);
  const [amount, setAmount] = useState(null);

  const generatePayload = () => {
    return formatPayloadForSubstrate([assetId, amount]);
  };

  const submitTransaction = payload => {
    const txResHandler = makeDefaultTxResHandler(api, setStatus);
    const tx = api.tx[PALLET_RPC][CALLABLE](...payload);
    const unsub = tx.signAndSend(fromAccount, txResHandler);
    setUnsub(() => unsub);
  };

  const onClickSubmit = () => {
    const payload = generatePayload();
    submitTransaction(payload);
  };

  const formIsDisabled = status && status.isProcessing();
  const buttonIsDisabled = !assetId || !amount;

  return (
    <>
      <Grid.Column width={2}/>
      <Grid.Column width={10}>
        <Header textAlign='center'>Init Asset</Header>
        <Form>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              label='Asset Id'
              type='number'
              state='assetId'
              onChange={e => setAssetId(new BN(e.target.value))}
              disabled={formIsDisabled}
            />
          </Form.Field>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              label='Total Supply'
              type='number'
              state='amount'
              onChange={e => setAmount(new BN(e.target.value))}
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
          <div style={{ overflowWrap: 'break-word' }}>{status && status.toString()}</div>
        </Form>
      </Grid.Column>
      <Grid.Column width={2}/>
    </>
  );
}
