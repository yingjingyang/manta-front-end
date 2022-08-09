// @ts-nocheck
import { usePrivateWallet } from 'contexts/privateWalletContext';
import { useSend } from 'pages/SendPage/SendContext';
import React from 'react';
import AccountSelect from '../../../components/Accounts/AccountSelect';


const PublicFromAccountSelect = () => {
  const {
    senderPublicAccount,
    senderPublicAccountOptions,
    setSenderPublicAccount
  } = useSend();

  const options = senderPublicAccountOptions?.map((account) => {
    return {
      value: { account, address: account.address },
      label: account.meta.name
    };
  });

  const selectedOption = senderPublicAccount && {
    value: senderPublicAccount,
    label: senderPublicAccount.meta.name
  };

  const onChangeOption = (option) => {
    if (option.value.address !== senderPublicAccount.address) {
      setSenderPublicAccount(option.value.account);
    }
  };

  return (
    <AccountSelect
      options={options}
      selectedOption={selectedOption}
      onChangeOption={onChangeOption}
    />
  );
};


const PrivateFromAccountSelect = () => {
  const { privateAddress  } = usePrivateWallet();
  const privateAddresses = privateAddress ? [privateAddress] : [];
  const options = privateAddresses?.map((address) => {
    return {
      value: { address },
      label: 'Private'
    };
  });
  const selectedOption = privateAddress ? options[0] : null;
  const onChangeOption = () => {
    return;
  };

  return (
    <AccountSelect
      options={options}
      selectedOption={selectedOption}
      onChangeOption={onChangeOption}
    />
  );
};

const FromAccountSelect = () => {
  const { senderAssetType } = useSend();
  return (
    <>
      {
        senderAssetType.isPrivate
          ? <PrivateFromAccountSelect />
          : <PublicFromAccountSelect />
      }
    </>
  );
};


export default FromAccountSelect;
