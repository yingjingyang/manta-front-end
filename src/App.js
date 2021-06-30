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

function Main () {
  const [accountAddress, setAccountAddress] = useState(null);
  const [wasm, setWasm] = useState(null);
  const [mantaKeyring, setMantaKeyring] = useState(null);
  const [fromAccount, setFromAccount] = useState(null);
  const { api, apiState, keyring, keyringState, apiError } = useSubstrate();

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
        store.set('mantaAddresses', {});
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
    async function loadWasm () {
      const wasm = await import('manta-api');
      setWasm(wasm);
    }
    loadWasm();
  }, []);

  useEffect(() => {
    async function loadMantaKeying () {
      const keyring = new MantaKeyring();
      await keyring.init();
      setMantaKeyring(keyring);
    }
    loadMantaKeying();
  }, []);

  useEffect(() => {
    async function loadFromAccount (accountPair) {
      if (!api || !api.isConnected || !accountPair) {
        return;
      }
      const fromAccount = await getFromAccount(accountPair, api);
      setFromAccount(fromAccount);
    }
    loadFromAccount(accountPair, api);
  }, [api, accountPair]);

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
            <Routes fromAccount={fromAccount} wasm={wasm} mantaKeyring={mantaKeyring} />
          </Grid>
        </Container>
        <DeveloperConsole />
      </Router>
    </div>
  );
}

export default function App () {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  );
}
