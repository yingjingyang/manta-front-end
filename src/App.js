import React, { useState, createRef, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Container, Dimmer, Loader, Grid, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import { SubstrateContextProvider, useSubstrate } from './substrate-lib';
import { DeveloperConsole } from './substrate-lib/components';

import Navbar from './Navbar';
import Routes from './Routes';
import store from 'store';

function Main () {
  // store.set('manta_utxos', [])
  const [accountAddress, setAccountAddress] = useState(null);
  const [wasm, setWasm] = useState(null);
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
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
    console.log(keyringState)
    return loader('Loading accounts (please review any extension\'s authorization)');
  }

  const contextRef = createRef();
  // console.log("account pair", accountPair.secretKey);

  return (
    <div ref={contextRef}>
        <Router>
            <Navbar setAccountAddress={setAccountAddress} />
            <Container style={{ paddingTop: '3em' }}>
            <Grid centered>
            <Routes accountPair={accountPair} wasm={wasm} />
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
