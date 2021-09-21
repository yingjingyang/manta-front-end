import React, { useState, useEffect } from 'react';
import { useExternalAccount } from 'contexts/ExternalAccountContext';
import MantaSelect from 'components/elements/MantaSelect';
import { useSubstrate } from 'contexts/SubstrateContext';

const AccountSelectDropdown = () => {
  const { keyring, keyringState } = useSubstrate();
  const { currentExternalAccount, setCurrentExternalAccount } = useExternalAccount();
  const [options, setOptions] = useState([]);
  const [defaultValue, setDefaultValue] = useState(null);

  useEffect(() => {
    if (keyringState === 'READY') {
      setOptions(keyring.getPairs().map(account => {
        return {'value': account.address, 'label': account.meta.name};
      }));
      currentExternalAccount && !defaultValue && setDefaultValue({
        'value': currentExternalAccount.address, 'label': currentExternalAccount.meta.name
      });
    }
  }, [currentExternalAccount, keyringState, keyring]);

  return (
    defaultValue &&
    <MantaSelect
      onChange={e => setCurrentExternalAccount(keyring.getPair(e.value))}
      options={options}
      className='w-40 border-0'
      defaultValue={defaultValue}
    />
  );
};

export default AccountSelectDropdown;
