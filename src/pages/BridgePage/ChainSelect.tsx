// @ts-nocheck
import classNames from 'classnames';
import { useTxStatus } from 'contexts/txStatusContext';
import React from 'react';
import Select, { components } from 'react-select';

const ChainSelect = ({ chain, chainOptions, setChain, isOriginChain }) => {
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
    <div>
      <Select
        className={classNames(
          'w-52 rounded-lg manta-bg-gray text-black dark:text-white',
          { disabled: disabled }
        )}
        isSearchable={false}
        isOriginChain={isOriginChain}
        value={chain}
        onChange={(option) => setChain(option.value)}
        options={dropdownOptions}
        placeholder=""
        styles={dropdownStyles}
        isDisabled={disabled}
        components={{
          Control: ChainControl,
          SingleValue: ChainSingleValue,
          Option: ChainOption,
          IndicatorSeparator: EmptyIndicatorSeparator
        }}
      ></Select>
    </div>
  );
};

const ChainControl = (props) => {
  const {
    selectProps: { isOriginChain }
  } = props;
  const chainControlLabel = isOriginChain ? 'From' : 'To'

  return (
    <div className="flex flex-col">
      <div className="relative w-48 left-5 top-3 text-manta-gray">
        {chainControlLabel}
      </div>
      <components.Control className="w-48 left-3" {...props} />
    </div>
  );
};

const EmptyIndicatorSeparator = () => {
  return <div />;
};

const ChainSingleValue = ({ data }) => {
  return (
    <div className="w-full cursor-pointer">
      <div className="flex items-center inline">
        <div className="ml-1 w-8 h-8">
          <img
            className="rounded-full"
            src={data?.icon}
            alt="icon"
          />
        </div>
        <div className="p-2 pl-3">
          <div className="text-lg text-black dark:text-white">
            {data?.displayName}
          </div>
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
  dropdownIndicator: () => ({ paddingRight: '1rem' }),
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
    fontSize: '12pt'
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
