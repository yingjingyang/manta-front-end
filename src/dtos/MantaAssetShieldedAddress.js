import { base64Encode } from '@polkadot/util-crypto';
import BN from 'bn.js';

export default class MantaAssetShieldedAddress {
  constructor(bytes) {
    this.assetId = new BN(bytes.slice(0, 4), 10, 'le');
    this.k = bytes.slice(4, 36);
    this.s = bytes.slice(36, 68);
    this.r = bytes.slice(68, 100);
    this.ecpk = bytes.slice(100, 132);
    this.checksum = bytes.slice(132, 136);
  }

  static fromStorage(storageObj) {
    const bytes = new Uint8Array(Object.values(storageObj));
    return new MantaAssetShieldedAddress(bytes);
  }

  serialize() {
    return Uint8Array.from([
      ...this.assetId.toArray('le', 4),
      ...this.k,
      ...this.s,
      ...this.r,
      ...this.ecpk,
      ...this.checksum
    ]);
  }

  toString() {
    return base64Encode(
      this.serialize()
    );
  }
}
