import React, { useState, useEffect } from 'react';
import { useExternalAccount } from 'contexts/externalAccountContext';
import MantaSelect from 'components/elements/MantaSelect';
import { useKeyring } from 'contexts/keyringContext';
import { setLastAccessedExternalAccountAddress } from 'utils/persistence/externalAccountStorage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


const AccountNotConnectedLabel = () => {
  return (
    <div  className="text-center">
      <p className="text-primary text-sm pb-2">Public Account</p>
      <p className="text-accent dark:text-white pb-2">
        <FontAwesomeIcon icon={faTimes} color="#FA4D56" />
        {' '}Not connected
      </p>
    </div>
  );
};

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
    <div className="text-center" >
      {defaultValue ? (
        <div>
          <p className="text-primary text-sm pb-1 ">Public Account</p>
          <MantaSelect
            onChange={e => onChangeCurrentAccount(e.value)}
            options={options}
            className="w-40 border-0"
            defaultValue={defaultValue}
          />
        </div>
      )
        : <AccountNotConnectedLabel/>
      }
    </div>
  );
};

export default AccountSelectDropdown;
