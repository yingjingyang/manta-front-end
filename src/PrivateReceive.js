import { BN_BILLION } from '@polkadot/util';
import React, { useState } from 'react';
import { Grid, Header, Form, Button, Input } from 'semantic-ui-react';
import BN from 'bn.js'

export default function Main ({ mantaKeyring }) {
  const [assetId, setAssetId] = useState(new BN(-1));
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
              onChange={e => setAssetId(new BN(e.target.value))}
            />
          </Form.Field>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            {address && address.toString()}
          </Form.Field>
          <Button disabled={!assetId.gt(new BN(-1))} onClick={showAddress}>
              Get new address
          </Button>
        </Form>
      </Grid.Column>
      <Grid.Column width={2}/>
    </>
  );
}
