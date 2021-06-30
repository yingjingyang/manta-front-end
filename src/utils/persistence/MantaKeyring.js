// todo: move to own library
// todo: encrypt storage
// todo: rigorously hide private key with closure like polkadot.js
import store from 'store';
import {
  mnemonicGenerate,
  mnemonicToMiniSecret,
  mnemonicValidate,
  naclKeypairFromSeed
} from '@polkadot/util-crypto';

const MIP_1_PURPOSE_INDEX = 3681947;
export const EXTERNAL_CHAIN_ID = 1; // todo check
export const INTERNAL_CHAIN_ID = 0; // todo check
export const MANTA_WALLET_BASE_PATH = `//${MIP_1_PURPOSE_INDEX}`; // /cointype/change/address


export default class MantaKeyring {

  async init () {
    this.wasm = await import('manta-api');
    if (!this.exists()) {
      store.set('mantaSecretKey', null);
      store.set('mantaAddresses', {});
    }
  }

  exists() {
    return store.get('mantaSecretKey', null) && store.get('mantaAddresses', null);
  }

  create(mnemonic) {
    const seed = mnemonicToMiniSecret(mnemonic);
    const { secretKey } = naclKeypairFromSeed(seed);
    store.set('mantaSecretKey', secretKey);
    store.set('mantaAddresses', {});
  }

  // Derive HD nodes
  _deriveAddress(path, assetId) {
    const secretKey = new Uint8Array(32).fill(0); // todo: get from storage
    console.log('path', path);
    const childSecret = this.wasm.generate_child_secret_key_for_browser(path, secretKey);
    return this.wasm.generate_shielded_address_for_browser(childSecret, assetId);
  }

  initAssetStorage(assetId) {
    let addresses = store.get('mantaAddresses');
    if (!addresses[assetId]) {
      addresses[assetId] = {};
      addresses[assetId][INTERNAL_CHAIN_ID] = [];
      addresses[assetId][EXTERNAL_CHAIN_ID] = [];
      store.set('mantaAddresses', addresses);
    }
  }

  _generateNextAddress(assetId, isInternal) {
    const chainId = isInternal ? EXTERNAL_CHAIN_ID : INTERNAL_CHAIN_ID;
    this.initAssetStorage(assetId);
    let addresses = store.get('mantaAddresses');
    const assetAddresses = addresses[assetId];
    const internalAddresses = assetAddresses[chainId];
    const addressIdx = internalAddresses.length;

    const path =
    `${MANTA_WALLET_BASE_PATH}//${assetId}//${chainId}//${addressIdx}`;
    const address = this._deriveAddress(path, assetId);

    // Save that we have generated address
    internalAddresses.push(address);
    store.set('mantaAddresses', addresses);
    console.log(addresses);

    return address;
  }

  generateNextInternalAddress(assetId) {
    return this._generateNextAddress(assetId, true);
  }

  generateNextExternalAddress(assetId) {
    return this._generateNextAddress(assetId, false);
  }

  generatePrivateTransferPayload() {
    return;
  }

  generateMintPayload() {
    return;
  }

  generateReclaimPayload() {
    return;
  }




}
