import React, { useState, useEffect, useRef } from 'react';
import { Form, Grid, Header, Input } from 'semantic-ui-react';
import { useSubstrate } from './substrate-lib';
import { base64Decode } from '@polkadot/util-crypto';
import _ from 'lodash';
import { loadSpendableAssetsById, loadSpendableAssets, persistSpendableAssets, loadSpendableBalances } from './utils/Persistence';
import BN from 'bn.js';
import TxStatus from './utils/ui/TxStatus';

export default function Main ({ fromAccount, wasm }) {
  // now
  // todo: batch transactions
  // todo: sort imports

  // later
  // todo: fix memory leak / pages shouldn't reset on switching labs page
  // todo: automatically generate proving keys on startup
  // todo: check that coins actually exist on startup (maybe they were spent on different computer)
  // todo: error types
  // todo: ledger state dto
  // todo: store pending spends
  // todo: generate new private keys and save in local storage / remove hardcoded keys
  // todo: poll assets we have received
  // todo: cleanup folder structure
  // todo: address derivation / change
  // todo: coin selection

  const { api } = useSubstrate();
  const [status, setStatus] = useState(null);
  const [transferPK, setTransferPK] = useState(null);
  const [address, setAddress] = useState(null);
  const [amount, setAmount] = useState(null);
  const [changeAmount, setChangeAmount] = useState(null);
  const [assetId, setAssetId] = useState(null);
  const [coinSelection, setCoinSelection] = useState([]);

  let selectedAsset1 = useRef(null);
  let selectedAsset2 = useRef(null);

  const changeAddress = 'AgAAAAAAAAA/kASJmPbjqlGVjxa6LDKsioBeHGu4aO6xb7uoWvigKLt85iX6jWXVUrXz9luKycQNg0MAAUWOAigr2PzLHasMYnebxo2JlY0XS7+Is8bjA5UCAGNdsEuywxlRObPk4QG2AcxbEpaWwiE3tHiMQAzT093tB8TWk4GfFx6I+j6lPg==';

  // select coins
  // generate payload for each two coins, with "0" change (make "0" coin)
  // for last two coins, one may contain change

  // for each selected coin pair, remove from browser storage

  useEffect(() => {
    if (!amount || !assetId) {
      return;
    }
    const spendableBalance = loadSpendableBalances()[assetId.toNumber()] || new BN(0);
    if (amount.gt(spendableBalance)) {
      setStatus(new TxStatus('Insufficient funds'));
    } else {
      setStatus(null);
      let totalAmount = new BN(0);
      const coinSelection = [];
      const spendableAssets = loadSpendableAssetsById(assetId);
      spendableAssets.forEach(asset => {
        if (totalAmount.lte(amount) || coinSelection.length % 2 === 1) {
          totalAmount = totalAmount.add(asset.privInfo.value);
          coinSelection.push(asset);
        }
      });
      setChangeAmount(totalAmount.sub(amount));
      setCoinSelection(coinSelection);
    }
  }, [amount, assetId]);

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

  const getLedgerState = async asset => {
    const shardIndex = asset.utxo[0];
    const shards = await api.query.mantaPay.coinShards();
    return shards.shard[shardIndex].list;
  };

  const generatePrivateTransferPayload = async () => {
    const spendableAssets = loadSpendableAssetsById(assetId);
    selectedAsset1 = spendableAssets[0];
    selectedAsset2 = spendableAssets[1];
    let ledgerState1 = await getLedgerState(selectedAsset1);
    let ledgerState2 = await getLedgerState(selectedAsset2);
    // flatten (wasm only accepts flat arrays)
    ledgerState1 = Uint8Array.from(ledgerState1.reduce((a, b) => [...a, ...b], []));
    ledgerState2 = Uint8Array.from(ledgerState2.reduce((a, b) => [...a, ...b], []));

    return [wasm.generate_private_transfer_payload_for_browser(
      selectedAsset1.serialize(),
      selectedAsset2.serialize(),
      ledgerState1,
      ledgerState2,
      transferPK,
      base64Decode(address.trim()),
      base64Decode(changeAddress)
    )];
  };

  const onPrivateTransferSuccess = () => {
    const spendableAssets = loadSpendableAssets()
      .filter(asset => !_.isEqual(asset, selectedAsset1) && !_.isEqual(asset, selectedAsset2));
    persistSpendableAssets(spendableAssets);

    selectedAsset1 = null;
    selectedAsset2 = null;
  };

  const onPrivateTransferFailure = () => {
    selectedAsset1 = null;
    selectedAsset2 = null;
  };

  const formDisabled = status && status.isProcessing();

  const buttonDisabled = (
    (status && status.isProcessing()) || !address || !assetId
  );

  return (
    <>
      <Grid.Column width={2}/>
      <Grid.Column width={12} textAlign='center'>
        <Header textAlign='center'>Private Transfer</Header>
        <Form>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              disabled={formDisabled}
              label='Asset ID'
              type='number'
              state='assetId'
              onChange={e => setAssetId(new BN(e.target.value))}
            />
          </Form.Field>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              disabled={formDisabled}
              label='Address'
              type='string'
              state='address'
              onChange={e => setAddress(e.target.value)}
            />
          </Form.Field>
          <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Input
              fluid
              disabled={formDisabled}
              label='Amount'
              type='number'
              state='amount'
              onChange={e => setAmount(new BN(e.target.value))}
            />
          </Form.Field>
          {/* <Form.Field style={{ textAlign: 'center' }}>
            <TxButton
              fromAccount={fromAccount}
              label='Submit'
              type='SIGNED-TX'
              setStatus={setStatus}
              disabled={buttonDisabled}
              attrs={{
                palletRpc: 'mantaPay',
                callable: 'privateTransfer',
                payloadGenerators: [generatePrivateTransferPayload, generatePrivateTransferPayload],
                onSuccess: onPrivateTransferSuccess,
                onFailure: onPrivateTransferFailure
              }}
            />
          </Form.Field> */}
          <div style={{ overflowWrap: 'break-word' }}>{status && status.toString()}</div>
        </Form>
      </Grid.Column>
      <Grid.Column width={2}/>
    </>
  );
}
