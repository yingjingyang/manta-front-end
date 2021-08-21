import React, { useState } from 'react';
import { Form, Input, Grid, Header } from 'semantic-ui-react';
import BN from 'bn.js';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';
import MAToAtomicUnits from './utils/ui/MAToAtomicUnit';
import TxButton from './TxButton';
import formatPayloadForSubstrate from './utils/api/FormatPayloadForSubstrate.js';
import { useSubstrate } from './substrate-lib';
import { makeDefaultTxResHandler } from './utils/api/MakeTxResHandler';
import TxStatusDisplay from './utils/ui/TxStatusDisplay';
import { PALLET, CALLABLE } from './constants/ApiConstants';

export default function Main ({ fromAccount }) {
  const { api } = useSubstrate();
  const [unsub, setUnsub] = useState(null);
  const [addressTo, setAddressTo] = useState(null);
  const [amount, setAmount] = useState(new BN(-1));
  const [status, setStatus] = useState(null);

  const generatePayload = () => {
    return formatPayloadForSubstrate([addressTo, MAToAtomicUnits(amount, api)]);
  };

  const submitTransaction = payload => {
    const txResHandler = makeDefaultTxResHandler(api, setStatus);
    const tx = api.tx[PALLET.BALANCES][CALLABLE.BALANCES.TRANSFER](...payload);
    const unsub = tx.signAndSend(fromAccount, txResHandler);
    setUnsub(() => unsub);
  };

  const onClickSubmit = () => {
    const payload = generatePayload();
    submitTransaction(payload);
  };

  const isValidSubstrateAddress = address => {
    try {
      encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));
  
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const formIsDisabled = status && status.isProcessing();
  const buttonIsDisabled = formIsDisabled || !isValidSubstrateAddress(addressTo) || !amount.gt(new BN(0));

  return (
    <Grid.Column width={8}>
      <Header textAlign='center'>Transfer MA Token</Header>
      <Form>
        <Form.Field style={{ width: '500px', textAlign: 'center', marginLeft: '2em' }}>
          <Input
            fluid
            label='To'
            type='text'
            placeholder='address'
            state='addressTo'
            onChange={e => setAddressTo(e.target.value)}
            disabled={formIsDisabled}
          />
        </Form.Field>
        <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
          <Input
            fluid
            label='Amount'
            type='number'
            placeholder='MA'
            state='amount'
            onChange={e => setAmount(new BN(e.target.value))}
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
        <TxStatusDisplay txStatus={status}/>
      </Form>
    </Grid.Column>
  );
}
