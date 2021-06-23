import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import { loadSpendableBalances } from './utils/Persistence';

export default function Main () {
  const balanceByAssetId = loadSpendableBalances();
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
