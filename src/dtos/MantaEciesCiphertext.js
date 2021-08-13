export default class MantaEciesCiphertext {
  constructor  (bytes) {
    this.encryptedMessage = bytes.slice(0, 36);
    this.ephemeralPk = bytes.slice(36, 68);
  }

  serialize() {
    return Uint8Array.from([
      ...this.encryptedMessage,
      ...this.ephemeralPk
    ]);
  }
}