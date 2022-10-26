// @ts-nocheck
import React from 'react';
import
AccountSelectDropdown,
{ substrateAccountToReactSelectOption, substrateAccountsToReactSelectOptions }
  from 'components/Accounts/AccountSelectDropdown';
import Chain from 'types/Chain';
import { useBridge } from './BridgeContext';
import MetamaskAccountDisplay from './MetamaskAccountDisplay';
import { useConfig } from 'contexts/configContext';

const BridgeOriginAccountSelect = () => {
  const config = useConfig();
  const {
    senderSubstrateAccountOptions,
    setSenderSubstrateAccount,
    senderSubstrateAccount,
    originChain
  } = useBridge();

  const options = substrateAccountsToReactSelectOptions(senderSubstrateAccountOptions);
  const selectedOption = substrateAccountToReactSelectOption(senderSubstrateAccount);
  const onChangeOption = (option) => {
    const { value: { account } } = option;
    setSenderSubstrateAccount(account);
  };

  return (
    <>
      {
        (originChain.parachainId === Chain.Moonriver(config).parachainId)
          ? <MetamaskAccountDisplay />
          : <AccountSelect
            options={options}
            selectedOption={selectedOption}
            onChangeOption={onChangeOption}
          />
      }
    </>
  );
};

export default BridgeOriginAccountSelect;
