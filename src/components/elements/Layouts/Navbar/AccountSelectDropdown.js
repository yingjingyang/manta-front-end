import React, { useState, useEffect } from 'react';
import { useExternalAccount } from 'contexts/externalAccountContext';
import MantaSelect from 'components/elements/MantaSelect';
import { useKeyring } from 'contexts/keyringContext';
import { setLastAccessedExternalAccountAddress } from 'utils/persistence/externalAccountStorage';

const AccountSelectDropdown = () => {
  const { keyring } = useKeyring();
  const { externalAccount, changeExternalAccount } = useExternalAccount();
  const [options, setOptions] = useState([]);
  const [defaultValue, setDefaultValue] = useState(null);

  const onChangeCurrentAccount = (currentAccountAddress) => {
    changeExternalAccount(keyring?.getPair(currentAccountAddress));
    setLastAccessedExternalAccountAddress(currentAccountAddress);
  };

  useEffect(() => {
    if (keyring) {
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
  }, [externalAccount, keyring]);

  return (
    defaultValue && (
      <div>
        <p className="text-primary text-sm pl-7 pb-1">Public Account</p>
        <MantaSelect
          onChange={e => onChangeCurrentAccount(e.value)}
          options={options}
          className="w-40 border-0"
          defaultValue={defaultValue}
        />
      </div>
    )
  );
};

export default AccountSelectDropdown;
