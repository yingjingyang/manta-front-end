import React, { useState, createRef, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Container, Dimmer, Loader, Grid, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import store from 'store';
import { SubstrateContextProvider, useSubstrate } from './substrate-lib';
import { DeveloperConsole } from './substrate-lib/components';

import Navbar from './Navbar';
import Routes from './Routes';
import getFromAccount from './utils/api/GetFromAccount';
import MantaKeyring from './utils/persistence/MantaKeyring';
import axios from 'axios';
import BN from 'bn.js';


import { loadSpendableAssets, persistSpendableAssets } from './utils/persistence/AssetStorage';

function Main() {
  axios.defaults.baseURL = 'http://localhost:29986/';

  console.log('spendable assets', loadSpendableAssets());


  const [accountAddress, setAccountAddress] = useState(null);
  const [mantaKeyring, setMantaKeyring] = useState(null);
  const [fromAccount, setFromAccount] = useState(null);
  const { api, apiState, keyring, keyringState, apiError } = useSubstrate();

  useEffect(() => {
    if (!api || !api.isConnected || !mantaKeyring) {
      return;
    }
    const test_serialize = async () => {
      // axios.defaults.headers.post['Content-Type'] = 'application/json';
      // axios.defaults.headers.post['Access-Control-Allow-Origin'] = 'http://localhost:29986';
      // axios.defaults.headers.post['Access-Control-Allow-Credentials'] = 'true';

      await api.isReady;
      const params = api.createType('DeriveShieldedAddressParams', {
        'asset_id': 1,
        'path': 'm/0/0/0/0',
        'value': new BN(1000)
      });
      console.log('params', params);
      const res = await axios.post('debugPrint', params.toU8a());

      // const res = await axios.post('generateAsset', params.toU8a());
      console.log('res', res);

      // const res = mantaKeyring.wasm.serialize_recover_account_params(
      //   encryptedValesBytes,
      //   voidNumbersBytes,
      //   utxosBytes
      // );
    };
    // test_serialize();

  });


  // Reset utxo cache if using fresh dev node
  useEffect(() => {
    const clearUtxoCache = async () => {
      if (!api) return;
      const oldBlockNumber = store.get('block num') || 0;
      const currentBlock = await api.rpc.chain.getBlock();
      const currentBlockNumber = currentBlock.block.header.number.toNumber();
      store.set('block num', currentBlockNumber);
      if (currentBlockNumber < oldBlockNumber) {
        store.set('manta_spendable_assets', []);
        store.set('mantaSecretKey', null);
        store.set('mantaAddresses', null);
        console.log('Reset UTXO cache ');
      }
    };
    clearUtxoCache();
  }, [api]);


  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);

  useEffect(() => {
    async function loadMantaKeying() {
      const wasm = await import('manta-api');
      const keyring = new MantaKeyring(api, wasm);
      setMantaKeyring(keyring);
    }
    if (!api) return;
    loadMantaKeying();
  }, [api]);

  useEffect(() => {
    async function loadFromAccount(accountPair) {
      if (!api || !api.isConnected || !accountPair) {
        return;
      }
      const fromAccount = await getFromAccount(accountPair, api);
      setFromAccount(fromAccount);
    }
    loadFromAccount(accountPair, api);
  }, [api, accountPair]);




  // useEffect(() => {
  //   if (!api || !api.isConnected || !mantaKeyring) {
  //     return;
  //   }
  //   const recoverWallet = async () => {
  //     await api.isReady;
  //     console.log(api, 'api');
  //     const encryptedValues = await api.query.mantaPay.encValueList();
  //     const voidNumbers = await api.query.mantaPay.vNList();
  //     console.log(encryptedValues, 'encryptedVales');
  //     console.log(encryptedValues);
  //     const recoveredAssets = mantaKeyring.recoverWallet(encryptedValues, voidNumbers);
  //     persistSpendableAssets(recoveredAssets);

  //   };
  //   recoverWallet();
  // }, [api, mantaKeyring]);

  const loader = text =>
    <Dimmer active>
      <Loader size='small'>{text}</Loader>
    </Dimmer>;

  const message = err =>
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message negative compact floating
          header='Error Connecting to Substrate'
          content={`${JSON.stringify(err, null, 4)}`}
        />
      </Grid.Column>
    </Grid>;

  if (apiState === 'ERROR') return message(apiError);
  else if (apiState !== 'READY') return loader('Connecting to Substrate');

  if (keyringState !== 'READY') {
    return loader('Loading accounts (please review any extension\'s authorization)');
  }

  const contextRef = createRef();

  return (
    <div ref={contextRef}>
      <Router>
        <Navbar setAccountAddress={setAccountAddress} />
        <Container style={{ paddingTop: '3em' }}>
          <Grid centered>
            <Routes fromAccount={fromAccount} mantaKeyring={mantaKeyring} />
          </Grid>
        </Container>
        <DeveloperConsole />
      </Router>
    </div>
  );
}

export default function App() {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  );
}
