import React, { useState, useEffect } from 'react';
import { Grid, Header } from 'semantic-ui-react';
import { useSubstrate } from './substrate-lib';

export default function Main ({ accountPair }) {
  const { api } = useSubstrate();
  const [balanceByAssetId, setBalanceByAssetId] = useState({});

  useEffect(() => {
    function getPrivateBalances () {
      return 'todo';
    }
    getPrivateBalances();
  }, []);

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
