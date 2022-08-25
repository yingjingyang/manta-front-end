// @ts-nocheck
import React from 'react';
import AddressDisplay from 'components/Accounts/AccountDisplay';
import { useMetamask } from 'contexts/metamaskContext';

const MetamaskAccountDisplay = () => {
  const { ethAddress } = useMetamask();

  return (
    <AddressDisplay address={ethAddress} label={'Metamask'} />
  );
};

export default MetamaskAccountDisplay;
