export default class ClientAsset {
  constructor(assetId, value, keypath, utxo, shardIndex) {
    this.assetId = assetId;
    this.value = value;
    this.keypath = keypath;
    this.utxo = utxo;
    this.shardIndex = shardIndex;
    this.shard = null;
  }

  static fromSignerAsset(signerAsset) {
    return new ClientAsset(
      signerAsset.asset_id,
      signerAsset.value,
      signerAsset.keypath,
      signerAsset.utxo,
      signerAsset.shardIndex
    );
  }

  toSignerAsset(api) {
    return api.createType('MantaSignerInputAsset', {
      asset_id: this.assetId,
      value: this.value,
      utxo: this.utxo,
      keypath: this.keypath,
      shard_index: this.shardIndex,
    });
  }

  toU8a(api) {
    return this.toSignerAsset(api).toU8a();
  }

  fromU8a(u8a, api) {
    return api.createType('MantaSignerInputAsset', u8a);
  }

  setShard(shard) {
    this.shard = shard;
  }
}
