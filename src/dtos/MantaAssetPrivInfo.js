export default class MantaAssetPrivInfo {
  constructor (bytes) {
    this.value = bytes.slice(0, 8);
    // todo: this is bad bad bad
    this.sk = bytes.slice(8, 40);
  }
}
