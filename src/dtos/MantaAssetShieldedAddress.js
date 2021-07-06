import { base64Encode } from '@polkadot/util-crypto';
import BN from 'bn.js';

export default class MantaAssetShieldedAddress {
  constructor(bytes) {
    this.assetId = new BN(bytes.slice(0, 8), 10, 'le');
    this.k = bytes.slice(8, 40);
    this.s = bytes.slice(40, 72);
    this.r = bytes.slice(72, 104);
    this.ecpk = bytes.slice(104, 136);
  }

  static fromStorage(storageObj) {
    const bytes = new Uint8Array(Object.values(storageObj));
    return new MantaAssetShieldedAddress(bytes);
  }

  serialize() {
    return Uint8Array.from([
      ...this.assetId.toArray('le', 8),
      ...this.k,
      ...this.s,
      ...this.r,
      ...this.ecpk
    ]);
  }

  toString() {
    return base64Encode(
      this.serialize()
    );
  }
}
