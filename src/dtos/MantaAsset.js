import BN from 'bn.js';
import MantaAssetPubInfo from './MantaAssetPubInfo';
import MantaAssetPrivInfo from './MantaAssetPrivInfo';

export default class MantaAsset {
  constructor (bytes) {
    this.assetId = new BN(bytes.slice(0, 8), 10, 'le');
    this.utxo = bytes.slice(8, 40);
    this.voidNumber = bytes.slice(40, 72);
    this.pubInfo = new MantaAssetPubInfo(bytes.slice(72, 232));
    this.privIndo = new MantaAssetPrivInfo(bytes.slice(232, 272));
  }
}
