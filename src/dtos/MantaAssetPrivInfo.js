import BN from 'bn.js';

export default class MantaAssetPrivInfo {
  constructor (bytes) {
    this.value = new BN(bytes.slice(0, 8), 10, 'le');
    this.secret = bytes.slice(8, 40);
    this.ecsk = bytes.slice(40, 72);
  }

  serialize() {
    return Uint8Array.from([
      ...this.value.toArray('le', 8),
      ...this.secret,
      ...this.ecsk
    ]);
  }
}
