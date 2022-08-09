// @ts-nocheck
import React from 'react';
import { useSend } from 'pages/SendPage/SendContext';
import { useExternalAccount } from 'contexts/externalAccountContext';
import AccountSelect from '../../../components/Accounts/AccountSelect';

const PublicToAccountSelect = () => {
  const {
    receiverAddress,
    setReceiver
  } = useSend();
  const {
    externalAccountOptions
  } = useExternalAccount();

  const toReactSelectOption = (account) => {
    const label =  account?.meta.name;
    return {
      value: { account, address: account.address },
      label,
    };
  };
  const options = externalAccountOptions?.map(
    account => toReactSelectOption(account));

  const receiverAccount = externalAccountOptions.find(option => option.address === receiverAddress);
  const selectedOption = receiverAccount
    ? toReactSelectOption(receiverAccount)
    : null;

  console.log('selectedOption', selectedOption, options, receiverAddress);

  const onChangeOption = (option) => {
    const { value: { address } } = option;
    setReceiver(address);
  };

  return (
    <AccountSelect
      options={options}
      selectedOption={selectedOption}
      onChangeOption={onChangeOption}
    />
  );
};


const PrivateToAccountSelect = () => {
  const {
    receiverAddress,
    setReceiver,
    accountOptions,
  } = useSend();

  const toReactSelectOption = (address) => {
    return {
      value: { address },
      label: 'Private',
    };
  };

  const reactSelectOptions = accountOptions?.map((address) => {
    return toReactSelectOption(address);
  });

  const selectedOption = receiverAddress ? toReactSelectOption(receiverAddress) : null;

  const onChangeOption = (option) => {
    const { value: { address } } = option;
    setReceiver(address);
  };

  return (
    <AccountSelect
      options={reactSelectOptions}
      selectedOption={selectedOption}
      onChangeOption={onChangeOption}
    />
  );
};

const ToAccountSelect = () => {
  const { receiverAssetType } = useSend();
  return (
    receiverAssetType.isPrivate
      ? <PrivateToAccountSelect />
      : <PublicToAccountSelect />
  );
};

export default ToAccountSelect;
