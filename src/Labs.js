import React, { useState } from 'react';
import { Form, Input, Grid, Header } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';

export default function Main (props) {
  const [status, setStatus] = useState(null);
  const [formState, setFormState] = useState({ addressTo: null, amount: 0 });
  const { accountPair } = props;

  const onChange = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: data.value }));

  const { sender1, sender2, receiver1, receiver2, proof } = formState;

  return (
    <Grid.Column width={8}>
      <Header textAlign='center'>Private Transfer</Header>
      <Form>
        <Form.Field style={{ width: '600px' }}>
          <Input
            fluid
            label='sender1'
            type='text'
            placeholder='base64 string'
            state='sender1'
            onChange={onChange}
            />
        </Form.Field>
        <Form.Field style={{ width: '600px' }}>
          <Input
            fluid
            label='sender2'
            type='text'
            placeholder='base64 string'
            state='sender2'
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field style={{ width: '600px' }}>
          <Input
            fluid
            label='receiver1'
            type='text'
            placeholder='base64 string'
            state='receiver1'
            onChange={onChange}
          />
          </Form.Field>
          <Form.Field style={{ width: '600px' }}>
          <Input
            fluid
            label='receiver2'
            type='text'
            placeholder='base64 string'
            state='receiver2'
            onChange={onChange}
          />
          </Form.Field>
          <Form.Field style={{ width: '600px' }}>
          <Input
            fluid
            label='proof'
            type='text'
            placeholder='base64 string'
            state='proof'
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
              callable: 'mantaTransfer',
              inputParams: [sender1, sender2, receiver1, receiver2, proof],
              paramFields: [true, true, true, true, true]
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}
