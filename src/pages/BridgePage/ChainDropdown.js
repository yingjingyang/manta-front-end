import React, { useState, useMemo, useEffect } from 'react';
import Select, { components } from 'react-select';

const ChainDropdown = ({ chains, activeChain, setActiveChain }) => {
  return (
    <Select
      className="w-full"
      isSearchable={false}
      value={activeChain}
      onChange={(option) => setActiveChain(option.value)}
      options={chains}
      placeholder=""
      styles={dropdownStyles}
      components={{
        SingleValue: ChainSingleValue,
        Option: ChainOption,
        IndicatorSeparator: EmptyIndicatorSeparator
      }}
    ></Select>
  );
};

const EmptyIndicatorSeparator = () => {
  return <div />;
};

const ChainSingleValue = ({ data }) => {
  return (
    <div className="pl-2 border-0 flex">
      <div className="pl-3">
        <img
          className="w-10 h-10 left-2 absolute manta-bg-secondary rounded-full"
          src={data.logo}
          alt="icon"
        />
      </div>
      <div className="text-2xl pl-8 pt-1 text-white">{data.name}</div>
    </div>
  );
};

const ChainOption = (props) => {
  const { value, innerProps } = props;
  return (
    <div {...innerProps} className="w-full cursor-pointer">
      <div className="flex items-center inline hover:bg-blue-100 py-1">
        <div>
          <img
            className=" w-6 h-6 ml-3  manta-bg-secondary rounded-full"
            src={value.logo}
            alt="icon"
          />
        </div>
        <div className="pl-4">
          {/* <components.Option {...props} /> */}
          <div className="text-xs block ">{value.name}</div>
        </div>
      </div>
    </div>
  );
};

const dropdownStyles = {
  dropdownIndicator: () => ({ paddingRight: '1rem', color: 'white' }),
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
    cursor: 'pointer'
  }),
  option: () => ({
    fontSize: '12pt'
  }),
  valueContainer: () => ({
    minHeight: '2rem',
    minWidth: '75%',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'flex-start'
  }),
  menu: (provided) => ({
    ...provided
  })
};

export default ChainDropdown;
