import BN from 'bn.js';

export default async function getLedgerState(asset, api) {
  const shardIndex = asset.utxo[0];
  const shards = await api.query.mantaPay.coinShards();
  let ledgerState = shards.shard[shardIndex].list;
  // If zero asset, it won't be on chain yet
  if (asset.value.eq(new BN(0))) {
    ledgerState.push(asset.utxo);
  }
  return ledgerState;
}
