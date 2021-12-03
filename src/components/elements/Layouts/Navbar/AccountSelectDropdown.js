import React, { useState, useEffect } from 'react';
import { useExternalAccount } from 'contexts/externalAccountContext';
import MantaSelect from 'components/elements/MantaSelect';
import { useSubstrate } from 'contexts/substrateContext';
import { useTxStatus } from 'contexts/txStatusContext';
import classNames from 'classnames';

const AccountSelectDropdown = () => {
  const { keyring, keyringState } = useSubstrate();
  const { txStatus } = useTxStatus();
  const { externalAccount, changeExternalAccount } = useExternalAccount();
  const [options, setOptions] = useState([]);
  const [defaultValue, setDefaultValue] = useState(null);


  useEffect(() => {
    if (keyringState === 'READY') {
      setOptions(
        keyring.getPairs().map((account) => {
          return { value: account.address, label: account.meta.name };
        })
      );
      externalAccount &&
        !defaultValue &&
        setDefaultValue({
          value: externalAccount.address,
          label: externalAccount.meta.name,
        });
    }
  }, [externalAccount, keyringState, keyring]);

  return (
    defaultValue && (
      <MantaSelect
        onChange={(e) => changeExternalAccount(keyring.getPair(e.value))}
        options={options}
        className='w-40 border-0'
        defaultValue={defaultValue}
      />
    )
  );
};

export default AccountSelectDropdown;
