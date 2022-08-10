// @ts-nocheck
import React from 'react';
import AssetType from 'types/AssetType';
import
AccountSelect,
{ substrateAccountToReactSelectOption, substrateAccountsToReactSelectOptions }
  from 'components/Accounts/AccountSelect';
import Chain from 'types/Chain';
import { useBridge } from './BridgeContext';
import MetamaskAccountDisplay from './MetamaskAccountDisplay';

const BridgeDestinationAccountSelect = () => {
  const {
    senderSubstrateAccountOptions,
    setSenderDestinationSubstrateAccount,
    senderDestinationSubstrateAccount,
    destinationChain
  } = useBridge();

  const options = substrateAccountsToReactSelectOptions(senderSubstrateAccountOptions);
  const selectedOption = substrateAccountToReactSelectOption(senderDestinationSubstrateAccount);
  const onChangeOption = (option) => {
    const { value: { account } } = option;
    setSenderDestinationSubstrateAccount(account);
  };

  return (
    <>
      {
        (destinationChain.parachainId === Chain.Moonriver().parachainId)
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

export default BridgeDestinationAccountSelect;
