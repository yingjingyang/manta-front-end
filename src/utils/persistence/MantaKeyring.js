// todo: move to own library
// todo: encrypt storage
// todo: rigorously hide private key with closure like polkadot.js
import store from 'store';
import {
  mnemonicToMiniSecret,
  naclKeypairFromSeed
} from '@polkadot/util-crypto';
import BN from 'bn.js';
import MantaAsset from '../../dtos/MantaAsset';
import MantaAssetShieldedAddress from '../../dtos/MantaAssetShieldedAddress';
import MantaAssetReceiverSpendingInfo from '../../dtos/MantaAssetReceiverSpendingInfo';

const MIP_1_PURPOSE_INDEX = 3681947;
export const EXTERNAL_CHAIN_ID = 1; // todo check
export const INTERNAL_CHAIN_ID = 0; // todo check
export const MANTA_WALLET_BASE_PATH = `//${MIP_1_PURPOSE_INDEX}`; // /cointype/change/address


// todo: class for keypath
// todo: can hide internal functions by making consts
export default class MantaKeyring {

  constructor(api, wasm) {
    this.api = api;
    this.wasm = wasm
    if (!store.get('mantaAddresses')) {
      store.set('mantaAddresses', {})
    }
  }

  async init () {
    return
    // const paths = this.getAllPaths();
    // // const ecsks = paths.map(path => {
    // //   const secret = this.wasm.generate_child_secret_key_for_browser(path, new Uint8Array(32).fill(0));
    // //   return new MantaAssetReceiverSpendingInfo(
    // //     this.wasm.generate_spending_info_for_browser(secret, path.split("//").filter(x => x)[1])).ecsk
    // // });
    // const ecpks = paths.map(path => this._deriveAddress(path).ecpk)

    // const encodedValues = await this.api.query.mantaPay.encValueList();
    // encodedValues.forEach(value => {
    //   for (let i = 0; i < paths.length; i++) {
    //     // // console.log('i', i)
    //     // const res = this.wasm.decrypt_ecies_for_browser(ecsks[i], ecpks[i], value);
    //     // // console.log(secrets[i])
    //     // console.log(ecpks[i])
    //     // // console.log('encoded', value)
    //     // console.log('res', res)
    //   }
    // });
  }

  importMnemonic(mnemonic) {
    const seed = mnemonicToMiniSecret(mnemonic);
    const { secretKey } = naclKeypairFromSeed(seed);
    store.set('mantaSecretKey', secretKey);
    store.set('mantaAddresses', {});
  }

  hasSecretKey() {
    const key = this.getSecretKey()
    return key !== null;
  }

  getSecretKey() {
    return store.get('mantaSecretKey', null);
  }
 

  getAllPaths () {
    const addressesStorage = store.get('mantaAddresses');
    const assetIds = Object.keys(addressesStorage);
    const paths = []
    for (let i = 0; i < assetIds.length; i++) {
      let assetId = assetIds[i];
      const externalChain = addressesStorage[assetId][EXTERNAL_CHAIN_ID]
      const internalChain = addressesStorage[assetId][INTERNAL_CHAIN_ID]
      for (let j = 0; j < externalChain.length; j++) {
        paths.push(`${MANTA_WALLET_BASE_PATH}//${assetId}//${EXTERNAL_CHAIN_ID}//${j}`)
      }
      for (let j = 0; j < internalChain.length; j++) {
        paths.push(`${MANTA_WALLET_BASE_PATH}//${assetId}//${INTERNAL_CHAIN_ID}//${j}`)
      }
    }
    return paths
  }

  // getAllAddresses () {
  //   const addressesStorage = store.get('mantaAddresses');
  //   const addressesByAsset = Object.entries(addressesStorage).map(([_,v]) => v);
  //   const addressList = Object.entries(addressesByAsset).flatMap(([_,v]) => Object.entries(v).flatMap((([_2, v2]) => v2)));
  //   return addressList.map(address => MantaAssetShieldedAddress.fromStorage(address));
  // }

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
  _deriveAddress(path) {
    console.log('deriving address with path:', path)
    const assetId = path.split("//").filter(x => x)[1];
    const secretKey = this.getSecretKey(); // todo: get from storage
    const childSecret = this.wasm.generate_child_secret_key_for_browser(path, secretKey);
    const address = this.wasm.generate_shielded_address_for_browser(childSecret, assetId)
    const res = new MantaAssetShieldedAddress(address);
    return res
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
    
    // Save that we have generated address
    internalAddresses.push(true);
    store.set('mantaAddresses', addresses);

    const address = this._deriveAddress(path);
    return address;
  }

  generateNextInternalAddress(assetId) {
    return this._generateNextAddress(assetId, true);
  }

  generateNextExternalAddress(assetId) {
    return this._generateNextAddress(assetId, false);
  }

  generateMintAsset(assetId, amount) {
    // console.log(assetId, 'assetid')
    // todo: save mint asset on success only?
    const secretKey = this.getSecretKey(); // todo: get from storage
    this.generateNextInternalAddress(assetId);

    let addressIdx = store.get('mantaAddresses')[assetId][INTERNAL_CHAIN_ID].length - 1;
    const path =
    `${MANTA_WALLET_BASE_PATH}//${assetId}//${INTERNAL_CHAIN_ID}//${addressIdx}`;

    const childSecret = this.wasm.generate_child_secret_key_for_browser(path, secretKey);
    const res = new MantaAsset(
      this.wasm.generate_mint_asset_for_browser(
        childSecret, assetId, amount.toArray('le', 16)
      )
    );
    // console.log('res', res)
    // console.log(res.privInfo.value, new MantaAsset(res.serialize()))
    return res;
  }

  generateChangeAsset(assetId, amount) {
    console.log('assetId', assetId)
    this.generateNextInternalAddress(assetId);
    
    let addressIdx = store.get('mantaAddresses')[assetId][INTERNAL_CHAIN_ID].length - 1;
    const path =
    `${MANTA_WALLET_BASE_PATH}//${assetId}//${INTERNAL_CHAIN_ID}//${addressIdx}`;
    const secretKey = this.getSecretKey(); // todo: get from storage
    const childSecret = this.wasm.generate_child_secret_key_for_browser(path, secretKey);

    const prngSeed = new Uint8Array(32);
    window.crypto.getRandomValues(prngSeed); 

    let res;
    
    [0, 0].forEach(_ => {
      res =  new MantaAsset(
        this.wasm.generate_change_asset_for_browser(
          childSecret, assetId, amount.toArray('le', 16), prngSeed
        )
      );
      console.log('duplicate', res.assetId)
    }) 
    return res; 
  }

  generateMintPayload(mintAsset) {
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
    const prngSeed = new Uint8Array(32);
    window.crypto.getRandomValues(prngSeed); 
    return await this.wasm.generate_private_transfer_payload_for_browser(
      asset1,
      asset2,
      ledgerState1,
      ledgerState2,
      transferPK,
      receivingAddress,
      changeAddress,
      spendAmount.toArray('le', 16),
      changeAmount.toArray('le', 16),
      prngSeed
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
    const prngSeed = new Uint8Array(32);
    window.crypto.getRandomValues(prngSeed); 
    console.log(prngSeed,     asset1,
      asset2,
      ledgerState1,
      ledgerState2,
      reclaimAmount,
      reclaimPK,
      changeAddress)
    return await this.wasm.generate_reclaim_payload_for_browser(
      asset1,
      asset2,
      ledgerState1,
      ledgerState2,
      reclaimAmount,
      reclaimPK,
      changeAddress,
      prngSeed
    );
  }




}
