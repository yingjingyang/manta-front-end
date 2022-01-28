import React, { useState, useEffect } from 'react';
import { useExternalAccount } from 'contexts/externalAccountContext';
import { useKeyring } from 'contexts/keyringContext';
import { setLastAccessedExternalAccountAddress } from 'utils/persistence/externalAccountStorage';
import Select, { components } from 'react-select';

const PublicFromAccountSelect = () => {
  const { keyring } = useKeyring();
  const { externalAccount, changeExternalAccount } = useExternalAccount();

  const [options, setOptions] = useState([]);
  const selectedOption = externalAccount && {
    value: externalAccount, label: externalAccount.meta.name
  };

  useEffect(() => {
    if (keyring) {
      setOptions(keyring.getPairs().map(pair => {
        return {'value': pair.address, 'label': pair.meta.name};
      }));
    }
  }, [externalAccount, keyring]);


  const onChangeOption = (option) => {
    changeExternalAccount(keyring.getPair(option.value));
    setLastAccessedExternalAccountAddress(option.value);
  };

  return (
    <Select
      isSearchable={false}
      value={selectedOption}
      onChange={onChangeOption}
      options={options}
      placeholder=""
      styles={dropdownStyles}
      components={
        {
          SingleValue: AccountSelectSingleValue,
          Option: AccountSelectOption,
          IndicatorSeparator: EmptyIndicatorSeparator,
        }
      }
    />
  );
};

const AccountSelectSingleValue = ({data}) => {
  return (
    <div className="pl-2 border-0">
      <div className="text-lg text-white">
        {data.value.meta.name}
      </div>
      <div className="text-xs text-white">
        {data.value.address}
      </div>
    </div>
  );
};

const AccountSelectOption = (props) => {
  const { value, innerProps } = props;
  const onClick = () => {
    return;
  };
  return (
    <div {...innerProps}>
      <div className="flex items-center hover:bg-blue-100">
        <div onClick={onClick}  className="w-full pl-4 p-2">
          <components.Option {...props}>foo</ components.Option>
          <div className="text-xs block ">{value}</div>
        </div>
      </div>
    </div>
  );
};


const EmptyIndicatorSeparator = () => {
  return <div/>;
};



const dropdownStyles = {
  control: (provided) => ({
    ...provided,
    borderStyle: 'none',
    borderWidth: '0px',
    borderRadius: '0.5rem',
    backgroundColor: '#61abb9',
    paddingBottom: '0.5rem',
    paddingTop: '0.3rem',
    minHeight: '4.2rem',
    boxShadow: '0 0 #0000',
    cursor: 'pointer',
  }),
  dropdownIndicator: () => ({paddingRight: '1rem', color: 'white' }),
  option: () => ({
    fontSize: '12pt'
  }),
};

export default PublicFromAccountSelect;
