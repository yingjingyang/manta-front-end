import BN from 'bn.js';

export default class MantaAssetPrivInfo {
  constructor (bytes) {
    this.value = new BN(bytes.slice(0, 16), 10, 'le');
    this.secret = bytes.slice(16, 48);
    this.ecsk = bytes.slice(48, 80);
  }

  serialize() {
    return Uint8Array.from([
      ...this.value.toArray('le', 16),
      ...this.secret,
      ...this.ecsk
    ]);
  }
}
