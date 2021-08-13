import BN from 'bn.js';

export default class MintData {
  constructor (bytes) {
    this.assetId = new BN(bytes.slice(0, 4), 10, 'le');
    this.mintAmount = bytes.slice(4, 20);
    this.cm = bytes.slice(20, 52);
    this.k = bytes.slice(52, 84);
    this.s = bytes.slice(84, 116);
    this.encryptedNote = bytes.slice(116, 184);
  }
}
