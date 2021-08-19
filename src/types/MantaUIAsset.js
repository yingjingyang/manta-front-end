import BN from 'bn.js';


export default class MantaUIAsset {
  constructor (assetId, value, utxo, path) {
    this.assetId = assetId;
    this.value = value;
    this.utxo = utxo;
    this.path = path;
  }

  static fromBytes(bytes, api) {
    const assetId = new BN(bytes.slice(0, 4), 10, 'le').toNumber();
    const value = new BN(bytes.slice(4, 20), 10, 'le');
    const utxo = bytes.slice(20, 52);
    const path = api.createType('Text', bytes.slice(52)).toString();
    return new MantaUIAsset(assetId, value, utxo, path);
  }

  static fromStorage (obj) {
    console.log('storageobj', obj)
    return new MantaUIAsset(
      new BN(obj.assetId, 10, 'le').toNumber(),
      new BN(obj.value, 10, 'le'),
      new Uint8Array(obj.utxo),
      obj.path
    );
  }

  serialize () {
    const assetId = new BN(this.assetId);
    return {
      assetId: assetId.toArray('le', 4),
      value: this.value.toArray('le', 16),
      utxo: Array.from(this.utxo),
      path: this.path,
    };
  }
}
