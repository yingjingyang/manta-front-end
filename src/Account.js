import React, { useState } from 'react';
import { Form, Input, Button, Grid, Header } from 'semantic-ui-react';
import { useSubstrate } from './substrate-lib';
import {
  mnemonicGenerate,
  mnemonicValidate,
} from '@polkadot/util-crypto';

export default function Main ({ mantaKeyring }) {
  const [mnemonicInput, setMnemonicInput] = useState('')
  const [newMnemonic, setNewMnemonic] = useState()
  const [accountWasRecovered, setAccountWasRecovered] = useState(false)

  const mnemonicIsValid = () => {
      return mnemonicValidate(mnemonicInput.trim().split(' ').filter(x => x).join(' '))
    }

  const handleClickCreateNewAccount = () => {
    const newMnemonic = mnemonicGenerate()
    mantaKeyring.importMnemonic(newMnemonic)
    setNewMnemonic(newMnemonic)
  }


  const handleClickRecoverAccount = async () => {
    const mnemonic = mnemonicInput.trim().split(' ').filter(x => x).join(' ')
    mantaKeyring.importMnemonic(mnemonic)
    const encryptedVales = await api.query.mantaPay.encValueList()
    console.log(encryptedVales, 'encryptedVales')


    setAccountWasRecovered(true)
  }

  const newAccountSuccessMessage = (
    <>
      <p>New account successfully created</p>
      <p>Recovery phrase: {newMnemonic}</p>
    </>
  );

  const recoverAccountSuccessMessage = (
    <p>
      Account successfully recovered
    </p>
  )

  const createNewAccountForm = (
    <>
      <Header textAlign='center'>Create New Account</Header>
      <Form>
        <Form.Field style={{ width: '500px', marginLeft: '2em'}}>
          <Button onClick={handleClickCreateNewAccount}>
          Create
          </Button>
        </Form.Field>
      </Form>
    </>
  )

  const recoverAccountForm = (
    <>
    <Header textAlign='center' style={{margingTop: '8em'}}>Recover Account from Mnemonic</Header>
      <Form>
        <Form.Field style={{ width: '500px', marginLeft: '2em'}}>
            <Input
              fluid
              label='Mnemonmic'
              type='string'
              state='assetId'
              onChange={e => setMnemonicInput(e.target.value)}
            />
        </Form.Field>
        <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
            <Button 
                onClick={handleClickRecoverAccount}
                disabled={!mnemonicIsValid(mnemonicInput)}
            >
            Recover    
            </Button>
        </Form.Field>
      </Form>
    </>
  )

  return (
    <Grid.Column width={8}>
      <Form>
      {
        (!accountWasRecovered && ! newMnemonic) &&
        <>
          {createNewAccountForm}
          {recoverAccountForm}
        </>
      }
      {newMnemonic && newAccountSuccessMessage}
      {accountWasRecovered && recoverAccountSuccessMessage}
      </Form>
    </Grid.Column>
  );
}
