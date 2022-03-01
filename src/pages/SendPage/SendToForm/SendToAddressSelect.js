import { useSubstrate } from 'contexts/substrateContext';
import React from 'react';
import { useState } from 'react';
import Select, { components } from 'react-select';
import { useSend } from '../SendContext';


const SendToAddressSelect = ({
  internalAccountOptions,
  toReactSelectOption,
  validateAddress,
}) => {
  const { receiverAddress, receiverIsPrivate, setReceiver } = useSend();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const selectedOption = receiverAddress ? toReactSelectOption(receiverAddress): null;

  const [reactSelectExternalOptions, setReactSelectExternalOptions] = useState([]);
  const reactSelectInternalOptions = internalAccountOptions?.map(address => {
    return toReactSelectOption(address);
  });

  const optionGroups = [
    {
      label: `External ${receiverIsPrivate ? 'Private' : 'Public'} Account`,
      options: reactSelectExternalOptions
    },
    {
      label: `My ${receiverIsPrivate ? 'Private' : 'Public'} Accounts`,
      options: reactSelectInternalOptions
    }
  ];

  const onChangeOption = (option) => {
    const { isInternal, value: address } = option;
    setReceiver(isInternal, receiverIsPrivate, address);
    setReactSelectExternalOptions([]);
  };

  const onCloseMenu = (a, b, c) => {
    console.log(a, b, c, '!!');
    setMenuIsOpen(false);
    document.activeElement.blur();
  };


  return (
    <Select
      className="max-w-100"
      validateAddress={validateAddress}
      toReactSelectOption={toReactSelectOption}
      setReactSelectExternalOptions={setReactSelectExternalOptions}
      // `react-select` props
      value={selectedOption}
      options={optionGroups}
      onChange={onChangeOption}
      menuIsOpen={menuIsOpen}
      onMenuOpen={() => setMenuIsOpen(true)}
      onMenuClose={onCloseMenu}
      isSearchable={true}
      styles={styles}
      placeholder=""
      components={
        {
          SingleValue: SendToAddressSelectSingleValue,
          Option: SendToAddressSelectOption,
          IndicatorSeparator: EmptyIndicatorSeparator,
          Input: SendToAddressInput
        }
      }
    />
  );
};

const SendToAddressInput = (props) => {
  const { onChange: onChangeInputDefault, selectProps } = props;
  const {
    onChange: onChangeSelect,
    setReactSelectExternalOptions,
    toReactSelectOption,
    onMenuClose,
    validateAddress
  } = selectProps;
  const { api } = useSubstrate();

  // Unfocus input if user changes tab
  window.onblur = () => {
    document.activeElement.blur();
  };

  const onChangeInput = async (event) => {
    onChangeInputDefault(event);
    await api.isReady;
    const addressIsValid = await validateAddress(event.target.value, api);
    if (addressIsValid) {
      const address = event.target.value;
      const reactSelectOption = toReactSelectOption(address);
      !reactSelectOption.isInternal && setReactSelectExternalOptions([reactSelectOption]);
      onChangeSelect(reactSelectOption);
      onMenuClose();
      event.target.blur();
    } else {
      setReactSelectExternalOptions([]);
    }
  };

  return (
    <components.Input {...props} onChange={onChangeInput}/>
  );
};

const SendToAddressSelectSingleValue = (props) => {
  const { data, selectProps } = props;
  const { label, value } = data;
  return (
    <div>
      {!selectProps.menuIsOpen &&
        <div className="pl-2 border-0">
          <div className="text-lg">
            {label}
          </div>
          <div className="text-xs manta-gray w-80 overflow-hidden overflow-ellipsis">
            {value}
          </div>
        </div>
      }
    </div>
  );
};

const SendToAddressSelectOption = (props) => {
  const { value, label, innerProps } = props;
  return (
    <div {...innerProps}>
      <div className="flex items-center hover:bg-blue-100">
        <div className="w-full pl-4 p-2">
          <components.Option {...props}>{label}</ components.Option>
          <div className="text-xs manta-gray block ">{value}</div>
        </div>
      </div>
    </div>
  );
};

const EmptyIndicatorSeparator = () => {
  return <div/>;
};


const styles = {
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
    display: 'inline',
    minWidth: '0%',
    maxWidth: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }),
  // valueContainer: (provided) => ({
  //   ...provided,
  //   whiteSpace: 'nowrap',
  //   overflow: 'hidden',
  //   textOverflow: 'ellipsis',
  //   // maxHeight: '3.6rem',
  // })
};

export default SendToAddressSelect;
