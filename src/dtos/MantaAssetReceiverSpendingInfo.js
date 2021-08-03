import BN from 'bn.js';

export default class MantaAssetReceiverSpendingInfo {
    constructor (bytes) {
        this.assetId = new BN(bytes.slice(0, 4), 10, 'le');
        this.pk = bytes.slice(4, 36);
        this.sk = bytes.slice(36, 68);
        this.rho = bytes.slice(68, 100);
        this.voidNumber = bytes.slice(100, 132);
        this.ecsk = bytes.slice(132, 164);
    }
}