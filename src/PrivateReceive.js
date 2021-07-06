import React, { useState } from 'react';
import { Grid, Header, Form, Button, Input } from 'semantic-ui-react';

export default function Main ({ mantaKeyring }) {
  const [formState, setFormState] = useState({ assetId: null });
  const onChange = (_, data) => {
    setFormState(prev => ({ ...prev, [data.state]: data.value }));
  };
  const { assetId } = formState;
  const [address, setAddress] = useState(null);

  const showAddress = () => {
    setAddress(mantaKeyring.generateNextExternalAddress(assetId));
  };

  return (
    <>
      <Grid.Column width={2}/>
      <Grid.Column width={12} textAlign='center'>
        <Header textAlign='center'>Receive</Header>
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
            {address && address.toString()}
          </Form.Field>
          <Button onClick={showAddress}>
              Get new address
          </Button>
        </Form>
      </Grid.Column>
      <Grid.Column width={2}/>
    </>
  );
}
