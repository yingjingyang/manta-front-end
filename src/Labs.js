import React, { useState, useRef } from 'react';
import { Form, Grid, Header, Message, Label, Icon, Dropdown } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';
import { base64Decode, base64Validate, base64Encode } from '@polkadot/util-crypto';
import PrivateTransfer from './PrivateTransfer'
import Mint from './Mint'
import Reclaim from './Reclaim'

export default function Main ({ accountPair }) {
    const dropdownItems = [
    {
      key: "Private transfer",
      text: "Private transfer",
      value: "Private transfer",
    },
    {
      key: "Mint",
      text: "Mint",
      value: "Mint",
    },
    {
      key: "Reclaim",
      text: "Reclaim",
      value: "Reclaim",
    }
  ];
  const [dropdownState, changeDropdownState] = useState(dropdownItems[0])

  console.log(dropdownState)
  let page = <div/>
  if (dropdownState === 'Mint') {
    page = <Mint accountPair={accountPair} />
  } else if (dropdownState === 'Private transfer') {
    page = <PrivateTransfer accountPair={accountPair} />
  } else if (dropdownState === 'Reclaim') {
    page = <Reclaim accountPair={accountPair} />
  }

  return (
    <div textAlign='left'>
      <Dropdown
        onChange={(e, {value}) => {
          changeDropdownState(value)
          console.log('value', value)
        }}
        placeholder=''
        selection
        options={dropdownItems}
        style={{marginBottom: '2em' }}
      />
      {page}
    </div>
  )
};
