// @ts-nocheck
import React, { useState } from 'react';
import Select, { components } from 'react-select';
import Svgs from 'resources/icons';

const chains = [
  {
    value: {
      logo: Svgs.Calamari,
      label: 'Calamari'
    },
    label: 'Calamari'
  },
  {
    label: 'Karura',
    value: {
      logo: Svgs.KarIcon,
      label: 'Karura'
    }
  },
  {
    label: 'Kusama',
    value: {
      logo: Svgs.KusamaIcon,
      label: 'Kusama'
    }
  }
];

const ChainDropdown = () => {
  const [chain, setChain] = useState(chains[0].value);
  return (
    <Select
      className="w-full btn-primary rounded-md"
      isSearchable={false}
      value={chain}
      onChange={(option) => setChain(option.value)}
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
      <div className="text-xl pl-8 pt-1 text-white">{data.label}</div>
    </div>
  );
};

const ChainOption = (props) => {
  const { value, innerProps } = props;
  console.log({ value, innerProps });
  return (
    <div {...innerProps} className="w-full cursor-pointer">
      <div className="flex items-center inline hover:bg-blue-100">
        <div>
          <img
            className="w-10 h-10 ml-3 my-2 manta-bg-secondary rounded-full"
            src={value.logo}
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