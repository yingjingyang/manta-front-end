import BN from 'bn.js';

export default class MantaEciesMessage {
  constructor(bytes) {
    this.assetId = new BN(bytes.slice(0, 4), 10, 'le').toNumber();
    this.amount = new BN(bytes.slice(4), 10, 'le');
  }
}