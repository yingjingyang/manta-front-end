import BN from 'bn.js';
import MantaAssetPubInfo from './MantaAssetPubInfo';
import MantaAssetPrivInfo from './MantaAssetPrivInfo';
import MantaEciesCiphertext from './MantaEciesCiphertext';

export default class MantaAsset {
  constructor (bytes) {
    console.log('asset bytes', bytes)
    this.assetId = new BN(bytes.slice(0, 4), 10, 'le').toNumber();
    this.utxo = bytes.slice(4, 36);
    this.voidNumber = bytes.slice(36, 68);
    this.encryptedNote = new MantaEciesCiphertext(bytes.slice(68, 136));
    this.pubInfo = new MantaAssetPubInfo(bytes.slice(136, 328));
    this.privInfo = new MantaAssetPrivInfo(bytes.slice(328, 408));
  }

  static fromStorage (storageObj) {
    const bytes = new Uint8Array(Object.values(storageObj));
    return new MantaAsset(bytes);
  }

  serialize () {
    const assetId = new BN(this.assetId)
    return Uint8Array.from([
      ...assetId.toArray('le', 4),
      ...this.utxo,
      ...this.voidNumber,
      ...this.encryptedNote.serialize(),
      ...this.pubInfo.serialize(),
      ...this.privInfo.serialize()
    ]);
  }
}
