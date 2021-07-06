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
import BN from 'bn.js';
import MantaAsset from '../../dtos/MantaAsset';
import MantaAssetShieldedAddress from '../../dtos/MantaAssetShieldedAddress';

const MIP_1_PURPOSE_INDEX = 3681947;
export const EXTERNAL_CHAIN_ID = 1; // todo check
export const INTERNAL_CHAIN_ID = 0; // todo check
export const MANTA_WALLET_BASE_PATH = `//${MIP_1_PURPOSE_INDEX}`; // /cointype/change/address



// todo: can hide internal functions by making consts
export default class MantaKeyring {

  constructor(api) {
    this.api = api;
  }

  async init () {
    this.wasm = await import('manta-api'); // todo: this should be in a closure, not a member var
    if (!this.exists()) {
      store.set('mantaSecretKey', new Uint8Array(32).fill(0));
      store.set('mantaAddresses', {});
    }
    console.log(this.getAllAddresses());
    const encodedValues = await this.api.query.mantaPay.encValueList();
    // encodedValues.forEach(value => {
    //   console.log('value', value);
    //   const res = this.wasm.decrypt_ecies_for_browser(new Uint8Array(32).fill(0), value);
    //   console.log("decrypt", res);
    // });
  }

  getAllAddresses () {
    const addresses = store.get('mantaAddresses');
    const addrssesByAsset = Object.entries(addresses).map(([_,v]) => v);
    const addrssesByChain = Object.entries(addrssesByAsset).flatMap(([_,v]) => v);
    return addrssesByChain.map(address => MantaAssetShieldedAddress.fromStorage(address));
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



  initAssetStorage(assetId) {
    let addresses = store.get('mantaAddresses');
    if (!addresses[assetId]) {
      addresses[assetId] = {};
      addresses[assetId][INTERNAL_CHAIN_ID] = [];
      addresses[assetId][EXTERNAL_CHAIN_ID] = [];
      store.set('mantaAddresses', addresses);
    }
  }

  // todo: rename
  // Derive HD nodes
  _deriveAddress(path, assetId) {
    const secretKey = new Uint8Array(32).fill(0); // todo: get from storage
    const childSecret = this.wasm.generate_child_secret_key_for_browser(path, secretKey);
    return new MantaAssetShieldedAddress(
      this.wasm.generate_shielded_address_for_browser(childSecret, assetId));
  }

  _generateNextAddress(assetId, isInternal) {
    const chainId = isInternal ? INTERNAL_CHAIN_ID : EXTERNAL_CHAIN_ID;
    this.initAssetStorage(assetId);
    let addresses = store.get('mantaAddresses');
    const assetAddresses = addresses[assetId];
    const internalAddresses = assetAddresses[chainId];
    const addressIdx = internalAddresses.length;

    const path =
    `${MANTA_WALLET_BASE_PATH}//${assetId}//${chainId}//${addressIdx}`;
    const address = this._deriveAddress(path, assetId);

    // Save that we have generated address
    internalAddresses.push(address.serialize());
    console.log('addresses', addresses);
    store.set('mantaAddresses', addresses);
    return address;
  }

  generateNextInternalAddress(assetId) {
    return this._generateNextAddress(assetId, true);
  }

  generateNextExternalAddress(assetId) {
    return this._generateNextAddress(assetId, false);
  }

  generateMintAsset(assetId, mintAmount) {
    // todo: save mint asset on success only?
    const secretKey = new Uint8Array(32).fill(0); // todo: get from storage
    this.generateNextInternalAddress(assetId);

    let addressIdx = store.get('mantaAddresses')[assetId][INTERNAL_CHAIN_ID].length - 1;
    const path =
    `${MANTA_WALLET_BASE_PATH}//${assetId}//${INTERNAL_CHAIN_ID}//${addressIdx}`;
    const childSecret = this.wasm.generate_child_secret_key_for_browser(path, secretKey);
    return new MantaAsset(
      this.wasm.generate_asset_for_browser(
        childSecret, new BN(assetId), new BN(mintAmount)
      )
    );
  }

  generateMintPayload(mintAsset) {
    console.log('mintAsset', mintAsset);
    return this.wasm.generate_mint_payload_for_browser(mintAsset);

  }

  async generatePrivateTransferPayload(
    asset1,
    asset2,
    ledgerState1,
    ledgerState2,
    transferPK,
    receivingAddress,
    changeAddress,
    spendAmount,
    changeAmount
  ) {
    return this.wasm.generate_private_transfer_payload_for_browser(
      asset1,
      asset2,
      ledgerState1,
      ledgerState2,
      transferPK,
      receivingAddress,
      changeAddress,
      spendAmount,
      changeAmount
    );
  }

  async generateReclaimPayload(
    asset1,
    asset2,
    ledgerState1,
    ledgerState2,
    reclaimAmount,
    reclaimPK,
    changeAddress
  ) {
    return this.wasm.generate_reclaim_payload_for_browser(
      asset1,
      asset2,
      ledgerState1,
      ledgerState2,
      reclaimAmount,
      reclaimPK,
      changeAddress
    );
  }




}
