import React, { useState } from 'react';
import Select, { components } from 'react-select';

const chains = [
  {
    value: {
      logo: 'https://apps.acala.network/static/media/polkadot.2fc5f34a.svg',
      label: 'Polkadot'
    },
    label: 'Polkadot'
  },
  {
    label: 'Acala',
    value: {
      logo: 'https://apps.acala.network/static/media/acala.dbc77df4.svg',
      label: 'Acala'
    }
  }
];

const ChainDropdown = () => {
  const [chain, setChain] = useState(chains[0].value);
  return (
    <Select
      className="w-full"
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
          className="w-10 h-10 px-2 left-2 absolute manta-bg-secondary rounded-full"
          src={data.logo}
          alt="icon"
        />
      </div>
      <div className="text-2xl pl-8 pt-1 text-white">{data.label}</div>
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
            className="w-10 h-10 py-1 px-2 ml-3  manta-bg-secondary rounded-full"
            src={value.logo}
            alt="icon"
          />
        </div>
        <div className="pl-4 p-2">
          <components.Option {...props} />
          {/* <div className="text-xs block ">sss</div> */}
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
