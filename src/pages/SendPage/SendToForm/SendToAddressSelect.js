import React, { useState } from 'react';
import Select, { components } from 'react-select';


const SendToAddressSelect = () => {
  const options = [
    {
      label: 'My private account'
    }
  ];
  const selectedOption = options[0];

  const onChangeOption = (option) => {
    console.log(option);
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
          SingleValue: SendToAddressSelectSingleValue,
          Option: SendToAddressSelectOption,
          IndicatorSeparator: EmptyIndicatorSeparator,
        }
      }
    />
  );
};

const SendToAddressSelectSingleValue = (props) => {
  const {data} = props;
  console.log('props', props);
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

const SendToAddressSelectOption = (props) => {
  const { value, innerProps } = props;
  console.log('props', props);
  return (
    <div {...innerProps}>
      <div className="flex items-center hover:bg-blue-100">
        <div className="w-full pl-4 p-2">
          <components.Option {...props}>{}</ components.Option>
          <div className="text-xs manta-gray block ">{"10 pBTC"}</div>
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
    boxShadow: '0 0 #0000',
    cursor: 'pointer',
  }),
  dropdownIndicator: () => ({paddingRight: '1rem'}),
  option: () => ({
    fontSize: '12pt'
  }),
  input: () => ({
    fontSize: '1.125rem',
    paddingLeft: '0.6rem'
  })
};

export default SendToAddressSelect;
