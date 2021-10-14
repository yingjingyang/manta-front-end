import BN from 'bn.js';

async function getUTXOsByShard(shardIndex, api) {
  let storage = await api.query.mantaPay.ledgerShards.entries(shardIndex);
  return storage.map((storageItem) => storageItem[1][0]);
}

export default async function getLedgerState(asset, intermediateAssets, api) {
  // todo: change coinShards to new API
  let ledgerState = await getUTXOsByShard(asset.shard_index, api);
  let intermediateAssetUtxos = intermediateAssets
    .filter(
      (intermediateAsset) => intermediateAsset.shard_index === asset.shard_index
    )
    .map((asset) => asset.utxo);
  ledgerState = [...ledgerState, ...intermediateAssetUtxos];
  // If zero asset, it won't be on chain yet
  if (asset.value.eq(new BN(0))) {
    ledgerState.push(asset.utxo);
  }
  return ledgerState;
}
