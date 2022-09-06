// @ts-nocheck
import React from 'react';
import
AccountSelect,
{ substrateAccountToReactSelectOption, substrateAccountsToReactSelectOptions }
  from 'components/Accounts/AccountSelect';
import Chain from 'types/Chain';
import { useBridge } from './BridgeContext';
import MetamaskAccountDisplay from './MetamaskAccountDisplay';

const BridgeOriginAccountSelect = () => {
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
        (originChain.parachainId === Chain.Moonriver().parachainId)
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
