// @ts-nocheck
import React from 'react';
import Select, { components } from 'react-select';

const ChainDropdown = ({chain, chainOptions, setChain}) => {
  const dropdownOptions = chainOptions?.map((chain) => {
    return {
      id: `chain_${chain.name}`,
      key: chain.name,
      label: chain.name,
      value: chain
    };
  });

  return (
    <Select
      className="w-full btn-primary rounded-md"
      isSearchable={false}
      value={chain}
      onChange={(option) => setChain(option.value)}
      options={dropdownOptions}
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
          src={data?.icon}
          alt="icon"
        />
      </div>
      <div className="text-xl pl-8 pt-1 text-white">{data?.name}</div>
    </div>
  );
};

const ChainOption = (props) => {
  const { value, innerProps } = props;
  return (
    <div {...innerProps} className="w-full cursor-pointer">
      <div className="flex items-center inline hover:bg-blue-100">
        <div>
          <img
            className="w-10 h-10 ml-3 my-2 manta-bg-secondary rounded-full"
            src={value?.icon}
            alt="icon"
          />
        </div>
        <div className="pl-4 p-2">
          <components.Option {...props} />
        </div>
      </div>
    </div>
  );
};

const dropdownStyles = {
  dropdownIndicator: () => ({ paddingRight: '1rem', color: 'white' }),
  control: (provided) => ({
    ...provided,
    backgroundColor: 'transparent',
    borderStyle: 'none',
    borderWidth: '0px',
    borderRadius: '0.5rem',
    paddingBottom: '0.5rem',
    paddingTop: '0.3rem',
    minHeight: '4.2rem',
    boxShadow: '0 0 #0000',
    cursor: 'pointer'
  }),
  option: () => ({
    fontSize: '12pt',
    color: 'black'
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