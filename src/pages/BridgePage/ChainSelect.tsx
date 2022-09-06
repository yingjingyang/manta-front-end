// @ts-nocheck
import classNames from 'classnames';
import { useTxStatus } from 'contexts/txStatusContext';
import React from 'react';
import Select, { components } from 'react-select';

const ChainSelect = ({chain, chainOptions, setChain}) => {
  const { txStatus } = useTxStatus();
  const disabled = txStatus?.isProcessing();


  const dropdownOptions = chainOptions?.map((chain) => {
    return {
      id: `chain_${chain.name}`,
      key: chain.name,
      label: chain.displayName,
      value: chain
    };
  });

  return (
    <Select
      className={classNames(
        "w-52 rounded-2xl gradient-border text-black dark:text-white",  {"disabled": disabled}
      )}
      isSearchable={false}
      value={chain}
      onChange={(option) => setChain(option.value)}
      options={dropdownOptions}
      placeholder=""
      styles={dropdownStyles}
      isDisabled={disabled}
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
    <div  className="w-full cursor-pointer">
      <div className="flex items-center inline">
        <div>
          <img
            className="w-9 h-9 ml-2 my-2 rounded-full"
            src={data?.icon}
            alt="icon"
          />
        </div>
        <div className="p-2 pl-3">
        <div className="text-lg text-black dark:text-white">{data?.displayName}</div>
        </div>
      </div>
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
            className="w-9 h-9 ml-3 my-2 manta-bg-secondary rounded-full"
            src={value?.icon}
            alt="icon"
          />
        </div>
        <div className="pl-4 p-2 text-black">
          <components.Option {...props} />
        </div>
      </div>
    </div>
  );
};

const dropdownStyles = {
  dropdownIndicator: () => ({ paddingRight: '1rem'}),
  control: (provided) => ({
    ...provided,
    backgroundColor: 'transparent',
    borderStyle: 'none',
    borderWidth: '0px',
    borderRadius: '1rem',
    minHeight: '4.2rem',
    boxShadow: '0 0 #0000',
    cursor: 'pointer'
  }),
  option: () => ({
    fontSize: '12pt',
  }),
  valueContainer: () => ({
    minHeight: '2rem',
    minWidth: '80%',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'space-between'
  }),
  menu: (provided) => ({
    ...provided
  })
};

export default ChainSelect;
