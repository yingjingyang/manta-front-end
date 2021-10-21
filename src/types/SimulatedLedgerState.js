export default class SimulatedLedgerState {
  constructor(api) {
    this.api = api;
    this.offChainAssets = [];
  }

  addOffChainUTXO(utxo) {
    this.offChainUTXOs.push(utxo);
  }

  async getShard(asset) {
    const shardOnChain = await this._getShardOnChain(asset.shard_index);
    return this._addIntermediateAssetsToShard(shardOnChain, asset.shardIndex);
  }

  async _getShardOnChain(shardIndex) {
    let storage = await this.api.query.mantaPay.ledgerShards.entries(
      shardIndex
    );
    return storage.map((storageItem) => storageItem[1][0]);
  }

  _addIntermediateAssetsToShard(shardOnChain, shardIndex) {
    let shardOffChain = this.offChainAssets
      .filter((offChainAsset) => offChainAsset.shardIndex === shardIndex)
      .map((asset) => asset.utxo);
    return [...shardOnChain, ...shardOffChain];
  }
}
