import React, { useState, useEffect, createRef } from 'react';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import {
  Menu,
  Button,
  Dropdown,
  Container,
  Image,
  Sticky,
  Label
} from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';

function Main (props) {
  const { keyring } = useSubstrate();
  const { setAccountAddress } = props;
  const [accountSelected, setAccountSelected] = useState('');

  // Get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map(account => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase(),
    icon: 'user'
  }));
  const initialAddress =
  keyringOptions.length > 0 ? keyringOptions[0].value : '';

  // Set the initial address
  useEffect(() => {
    setAccountAddress(initialAddress);
    setAccountSelected(initialAddress);
  }, [setAccountAddress, initialAddress]);

  const onChange = address => {
    // Update state with new account address
    setAccountAddress(address);
    setAccountSelected(address);
  };

  const contextRef = createRef();

  return (
    <Sticky context={contextRef}>
      <Menu
        attached='top'
        tabular
        style={{
          backgroundColor: 'MidnightBlue',
          borderColor: 'MidnightBlue',
          paddingTop: '1em',
          paddingBottom: '1em'
        }}
      >
        <Container>
          <Menu.Menu position='left' style={{ alignItems: 'center' }}>
            <Menu.Item name='MA Token'>
              <Link to='/ma_token'>
                  MA Token
              </Link>
            </Menu.Item>
            <Menu.Item name='Labs' >
              <Link to='/labs'>
                Labs
              </Link>
            </Menu.Item>
            <Menu.Item name='Governance'>
              <Link to='/governance'>
                Governance
              </Link>
            </Menu.Item>
          </Menu.Menu>

          <Menu.Menu position='right' style={{ alignItems: 'center' }}>
            { !accountSelected
              ? <span>
                Add your account with the{' '}
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  href='https://polkadot.js.org/extension/'
                >
                  Polkadot JS Extension
                </a>
              </span>
              : null }
            <CopyToClipboard text={accountSelected}>
              <Button
                basic
                circular
                size='large'
                icon='user'
                color={accountSelected ? 'blue' : 'red'}
              />
            </CopyToClipboard>
            <Dropdown
              search
              selection
              clearable
              placeholder='Select an account'
              options={keyringOptions}
              onChange={(_, dropdown) => {
                onChange(dropdown.value);
              }}
              value={accountSelected}
            />
            <BalanceAnnotation accountSelected={accountSelected} />
          </Menu.Menu>
        </Container>
      </Menu>
    </Sticky>
  );
}

function BalanceAnnotation (props) {
  const { accountSelected } = props;
  const { api } = useSubstrate();
  const [accountBalance, setAccountBalance] = useState(0);

  // When account address changes, update subscriptions
  useEffect(() => {
    let unsubscribe;

    // If the user has selected an address, create a new subscription
    accountSelected &&
      api.query.system.account(accountSelected, balance => {
        setAccountBalance(balance.data.free.toHuman());
      })
        .then(unsub => {
          unsubscribe = unsub;
        })
        .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api, accountSelected]);

  return accountSelected
    ? <Label pointing='left'>
      <Image
        src={process.env.PUBLIC_URL + '/assets/favicon.ico'}
        wrapped
        style={{ width: '1.3rem', height: 'auto', marginRight: '0.5rem', marginBottom: '0.18rem' }}
      />
      {accountBalance}
    </Label>
    : null;
}

export default function AccountSelector (props) {
  const { api, keyring } = useSubstrate();
  return keyring.getPairs && api.query ? <Main {...props} /> : null;
}
