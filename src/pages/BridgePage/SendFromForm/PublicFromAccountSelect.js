import React from 'react';
import Select, { components } from 'react-select';
import { useSend } from '../SendContext';

const PublicFromAccountSelect = () => {
  const { senderPublicAccount, senderPublicAccountOptions, setSenderPublicAccount } = useSend();

  const options = senderPublicAccountOptions?.map(account => {
    return { value: account, label: account.meta.name };
  });

  const selectedOption = senderPublicAccount && {
    value: senderPublicAccount, label: senderPublicAccount.meta.name
  };

  const onChangeOption = (option) => {
    if (option.value.address !== senderPublicAccount.address) {
      setSenderPublicAccount(option.value);
    }
  };

  return (
    <Select
      className="w-100"
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
  const { label, value, innerProps } = props;
  const onClick = () => {
    return;
  };
  return (
    <div {...innerProps}>
      <div className="flex items-center hover:bg-blue-100">
        <div onClick={onClick}  className="w-full pl-4 p-2">
          <components.Option {...props}>{label}</ components.Option>
          <div className="text-xs block ">{value.address}</div>
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
    width: '100%'
  }),
  dropdownIndicator: () => ({paddingRight: '1rem', color: 'white' }),
  option: () => ({
    fontSize: '12pt'
  }),
};

export default PublicFromAccountSelect;
