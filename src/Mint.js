import React, { useState, useRef } from 'react';
import { Form, Grid, Header, Input } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';
import BN from 'bn.js';
import { loadSpendableAssets, persistSpendableAssets } from './utils/Persistence';
import MantaAsset from './dtos/MantaAsset';

export default function Main ({ accountPair, wasm }) {
  const [status, setStatus] = useState(null);
  const [assetId, setAssetId] = useState(null);
  const [mintAmount, setMintAmount] = useState(null);

  let mintAsset = useRef(null);

  const generateMintPayload = () => {
    mintAsset = new MantaAsset (
      wasm.generate_asset_for_browser(
        new Uint8Array(32).fill(0), new BN(assetId), new BN(mintAmount)
      )
    );
    const mintInfo = wasm.generate_mint_payload_for_browser(mintAsset.serialize());
    return mintInfo;
  };

  const onMintSuccess = () => {
    const spendableAssets = loadSpendableAssets();
    spendableAssets.push(mintAsset);
    persistSpendableAssets(spendableAssets);
    mintAsset = null;
  };

  const onMintFailure = () => {
    mintAsset = null;
  };

  const buttonDisabled = (status && status.isProcessing()) || !assetId || !mintAmount;
  const formDisabled = status && status.isProcessing();

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
              state='assetId'
              onChange={e => setAssetId(new BN(e.target.value))}
              disabled={formDisabled}
            />
          </Form.Field>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              label='Amount'
              type='number'
              state='mintAmount'
              onChange={e => setMintAmount(new BN(e.target.value))}
              disabled={formDisabled}
            />
          </Form.Field>
            <Form.Field style={{ textAlign: 'center' }}>
              <TxButton
                accountPair={accountPair}
                label='Submit'
                type='SIGNED-TX'
                setStatus={setStatus}
                disabled={buttonDisabled}
                attrs={{
                  palletRpc: 'mantaPay',
                  callable: 'mintPrivateAsset',
                  payloads: [generateMintPayload],
                  onSuccess: onMintSuccess,
                  onFailure: onMintFailure
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
