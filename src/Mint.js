import React, { useState, useRef } from 'react';
import { Form, Grid, Header, Input } from 'semantic-ui-react';
import BN from 'bn.js';
import TxButton from './TxButton';
import formatPayloadForSubstrate from './utils/api/FormatPayloadForSubstrate.js';
import { useSubstrate } from './substrate-lib';
import { loadSpendableAssets, persistSpendableAsset } from './utils/persistence/AssetStorage';
import TxStatus from './utils/api/TxStatus';
import { makeTxResHandler } from './utils/api/MakeTxResHandler';
import TxStatusDisplay from './utils/ui/TxStatusDisplay';
import { PALLET, CALLABLE } from './constants/ApiConstants';

export default function Main ({ fromAccount, mantaKeyring }) {
  const { api } = useSubstrate();
  const [unsub, setUnsub] = useState(null);
  const [status, setStatus] = useState(null);
  const [assetId, setAssetId] = useState(-1);
  const [mintAmount, setMintAmount] = useState(new BN(-1));

  let mintAsset = useRef(null);

  const generateMintPayload = mintAmount => {
    const mintAsset = mantaKeyring.generateMintAsset(assetId, mintAmount);
    const mintInfo = mantaKeyring.generateMintPayload(mintAsset.serialize());
    return [formatPayloadForSubstrate([mintInfo]), mintAsset];
  };

  const onTxSuccess = block => {
    persistSpendableAsset(mintAsset.current);
    mintAsset.current = null;
    setStatus(TxStatus.finalized(block));
  };

  const onTxFailure = (block, error) => {
    mintAsset.current = null;
    setStatus(TxStatus.failed(block, error));
  };

  const onTxUpdate = message => {
    setStatus(TxStatus.processing(message));
  };

  const submitTransaction = payload => {
    const handleTxResponse = makeTxResHandler(api, onTxSuccess, onTxFailure, onTxUpdate);
    const tx = api.tx[PALLET.MANTA_PAY][CALLABLE.MANTA_PAY.MINT_PRIVATE_ASSET](...payload);
    const unsub = tx.signAndSend(fromAccount, handleTxResponse);
    setUnsub(() => unsub);
  };

  const onClickSubmit = () => {
    const [payload, asset] = generateMintPayload(mintAmount);
    mintAsset.current = asset;
    submitTransaction(payload);
  };

  const formIsDisabled = status && status.isProcessing();
  const buttonIsDisabled = formIsDisabled || !(assetId > 0) || !mintAmount.gt(new BN(0));

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
              onChange={e => setAssetId(parseInt(e.target.value))}
              disabled={formIsDisabled}
            />
          </Form.Field>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              label='Amount'
              type='number'
              state='mintAmount'
              onChange={e => setMintAmount(new BN(e.target.value))}
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
          <TxStatusDisplay
            txStatus={status}
          />
        </Form>
      </Grid.Column>
      <Grid.Column width={2}/>
    </>
  );
}
