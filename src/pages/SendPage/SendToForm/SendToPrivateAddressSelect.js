import React from 'react';
import Select, { components } from 'react-select';


const SendToPrivateAddressSelect = () => {
  const options = [
    {
      label: 'My private account'
    }
  ];
  const selectedOption = options[0];

  const onChangeOption = (option) => {
    return;
  };

  return (
    <Select
      isSearchable={true}
      value={selectedOption}
      onChange={onChangeOption}
      options={options}
      placeholder=""
      styles={dropdownStyles}
      components={
        {
          SingleValue: SendToPrivateAddressSelectSingleValue,
          Option: SendToPrivateAddressSelectOption,
          IndicatorSeparator: EmptyIndicatorSeparator,
        }
      }
    />
  );
};

const SendToPrivateAddressSelectSingleValue = (props) => {
  const { data } = props;
  return (
    <div>
      {!props.selectProps.menuIsOpen &&
        <div className="pl-2 border-0">
          <div className="text-lg">
            {data.label}
          </div>
          <div className="text-xs manta-gray">
            {data.value ?? 'Balance: 10 pBTC'}
          </div>
        </div>
      }
    </div>
  );
};

const SendToPrivateAddressSelectOption = (props) => {
  const { value, innerProps } = props;
  return (
    <div {...innerProps}>
      <div className="flex items-center hover:bg-blue-100">
        <div className="w-full pl-4 p-2">
          <components.Option {...props}>{}</ components.Option>
          <div className="text-xs manta-gray block ">{'10 pBTC'}</div>
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
    borderWidth: '1px',
    borderRadius: '0.5rem',
    backgroundColor: '#f4f7fa',
    paddingBottom: '0.5rem',
    paddingTop: '0.3rem',
    minHeight: '4.2rem',
    width: '25rem',
    boxShadow: '0 0 #0000',
    cursor: 'pointer',
  }),
  dropdownIndicator: () => ({paddingRight: '1rem'}),
  option: () => ({
    fontSize: '12pt'
  }),
  input: (provided) => ({
    ...provided,
    fontSize: '1.125rem',
    paddingLeft: '0.6rem',
    display: 'block',
    maxWidth: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }),
};

export default SendToPrivateAddressSelect;
