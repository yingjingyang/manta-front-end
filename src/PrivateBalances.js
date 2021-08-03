import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import BN from 'bn.js';
import { loadSpendableBalances } from './utils/persistence/AssetStorage';

export default function Main ({ mantaKeyring }) {
  // const { api } = useSubstrate();


  const balanceByAssetId = loadSpendableBalances();

  // const getSpendableBalancesFromOnChain = async () => {
  //   return;
  // }

  return (
    <>
      <Grid.Column width={2}/>
      <Grid.Column width={12} textAlign='center'>
        <Header textAlign='center'>Private Balances</Header>
        {
          Object.entries(balanceByAssetId).map(([assetId, amount]) => {
            return <div key={assetId}>Asset{assetId}: {amount.toString(10)}</div>;
          })
        }
      </Grid.Column>
      <Grid.Column width={2}/>
    </>
  );
}
