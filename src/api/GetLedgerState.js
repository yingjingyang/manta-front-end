async function getUTXOsByShard(shardIndex, api) {
  let storage = await api.query.mantaPay.ledgerShards.entries(shardIndex);
  return storage.map((storageItem) => storageItem[1][0]);
}

export default async function getLedgerState(asset, intermediateAssets, api) {
  let ledgerState = await getUTXOsByShard(asset.shard_index, api);

  let intermediateAssetUtxos = intermediateAssets
    .filter(
      (intermediateAsset) => intermediateAsset.shard_index === asset.shard_index
    )
    .map((asset) => asset.utxo);
  ledgerState = [...ledgerState, ...intermediateAssetUtxos];

  if (
    !ledgerState.some(
      (utxo) => JSON.stringify(utxo) == JSON.stringify(asset.utxo)
    )
  ) {
    ledgerState.push(asset.utxo);
  }
  return ledgerState;
}
