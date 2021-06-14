import React, { useState, useEffect } from 'react';
import { Grid, Header } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';
import { useSubstrate } from './substrate-lib';
import MintData from './dtos/MintData';
import { setup } from './workers/PrivateBalancesWorker.js';

export default function Main ({ accountPair }) {
  const { api, keyring } = useSubstrate();
  const [balanceByAssetId, setBalanceByAssetId] = useState({});

  // todo: filter failed extrinsics
  const extrinsicSucceeded = (extrinsic, blockHash) => true;

  useEffect(() => {
    async function getPrivateBalances () {
      const myAddresses = keyring.getPairs().map(pair => pair.address);
      const balanceByAssetId = {};

      const currentBlock = await api.rpc.chain.getBlock();
      // const currentBlockNumber = currentBlock.block.header.number.toNumber();
      let blockNumber = 415702; // todo: add threading and start from 0
      while (blockNumber <= 415702) { // currentBlockNumber) {
        const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
        const signedBlock = await api.rpc.chain.getBlock(blockHash);
        signedBlock.block.extrinsics
          .filter(extrinsic => myAddresses.includes(extrinsic.signer.toString()))
          .filter(extrinsic => extrinsic.method._meta.name.toString() === 'mint_private_asset')
          .filter(extrinsic => extrinsicSucceeded(extrinsic, blockHash))
          .map(extrinsic => new MintData(extrinsic.method.args[0]))
          .forEach((mintData) => {
            balanceByAssetId[mintData.assetID] = mintData.mintAmount;
          });

        blockNumber = blockNumber + 1;
      }
      setBalanceByAssetId(balanceByAssetId);
    }
    getPrivateBalances();
  }, [api, keyring]);

  useEffect(() => {
    const myWorker = new Worker('./workers/PrivateBalancesWorker.js');
    myWorker.postMessage('ping');
    myWorker.onmessage = function (e) {
      console.log(e);
    };
  });

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
