import store from 'store';
import {
  mnemonicToMiniSecret,
  naclKeypairFromSeed
} from '@polkadot/util-crypto';
import BN from 'bn.js';
import _ from 'lodash';
import MantaAsset from '../../dtos/MantaAsset';
import MantaAssetShieldedAddress from '../../dtos/MantaAssetShieldedAddress';
import MantaAssetReceiverSpendingInfo from '../../dtos/MantaAssetReceiverSpendingInfo';
import MantaEciesMessage from '../../dtos/MantaEciesMessage';
import { loadSpendableAssets } from './AssetStorage';
import { base64Decode } from '@polkadot/util-crypto';
import axios from 'axios';




const BIP_42_PURPOSE_INDEX = 42;

const TESTNET_COIN_TYPE_ID = 1;
const CALAMARI_COIN_TYPE_ID = 611;
const MANTA_COIN_TYPE_ID = 612;

const DEFAULT_ACCOUNT_ID = 0;

export const EXTERNAL_CHAIN_ID = 0;
export const INTERNAL_CHAIN_ID = 1;

export const MANTA_WALLET_BASE_PATH = `m/${BIP_42_PURPOSE_INDEX}'/${MANTA_COIN_TYPE_ID}'/${DEFAULT_ACCOUNT_ID}'`;

const GAP_LIMIT = 20;
export default class MantaKeyring {

  constructor(api, wasm) {
    this.api = api;
    this.wasm = wasm;
    store.set('mantaSecretKey', Array(32).fill(0));
    if (!store.get('mantaAddresses')) {
      store.set('mantaAddresses', {[INTERNAL_CHAIN_ID]: [], [EXTERNAL_CHAIN_ID]: []});
    }
  }

  hasSecretKey() {
    const key = this.getSecretKey();
    return key !== null;
  }

  getSecretKey() {
    return store.get('mantaSecretKey', null);
  }

  recoverWallet(encryptedValues, voidNumbers) {
    const internalPath = `${MANTA_WALLET_BASE_PATH}/${INTERNAL_CHAIN_ID}`;
    const externalPath = `${MANTA_WALLET_BASE_PATH}/${EXTERNAL_CHAIN_ID}`;
    let internalAddressEndIndex = GAP_LIMIT;
    let externalAddressEndIndex = GAP_LIMIT;
    let assets = [];

    encryptedValues.forEach(({encrypted_msg, ephemeral_pk}) => {
      const internalAsset = this._tryRecoverAssetFromSingleEncryptedMessage(
        internalAddressEndIndex, encrypted_msg, ephemeral_pk, internalPath
      );
      if (internalAsset) {
        assets.push(internalAsset);
        internalAddressEndIndex++;
      } else {
        const externalAsset = this._tryRecoverAssetFromSingleEncryptedMessage(
          externalAddressEndIndex, encrypted_msg, ephemeral_pk, externalPath
        );
        if (externalAsset) {
          assets.push(externalAsset);
          externalAddressEndIndex++;
        }
      }
    });
    const res = assets.filter(asset => !voidNumbers.includes(asset.voidNumber));
    console.log(res, 'assets');
    return res;
  }

  _tryRecoverAssetFromSingleEncryptedMessage(addressEndIndex, encryptedMsg, ephemeralPk, basePath) {
    for (let i = 0; i < addressEndIndex; i++) {
      const path = `${basePath}/${i}`;
      const childSecret = this.wasm.generate_child_secret_key_for_browser(path, this.getSecretKey());
      const ecsk = this.wasm.generate_ecsk_for_browser(childSecret);
      try {
        const decrypted = this.wasm.decrypt_ecies_for_browser(ecsk, ephemeralPk, encryptedMsg);
        const message = new MantaEciesMessage(decrypted);
        console.log('message', message);
        const asset = new MantaAsset(
          this.wasm.generate_mint_asset_for_browser(
            childSecret, message.assetId, message.amount.toArray('le', 16)
          )
        );
        console.log('DECRYPT SUCCESS!', decrypted);
        return asset;
      } catch(error) {
        console.log('DECRYPT FAILED!', error);
      }
    }
  }

  _decryptEcies(ecsk, ecpk, ciphertext) {
    return this.wasm.decrypt_ecies_for_browser(
      ecsk, ecpk, ciphertext
    );
  }

  async _deriveAddress(path, assetId) {
    console.log('deriving address with path:', path);
    const params = this.api.createType('DeriveShieldedAddressParams', {
      'asset_id': assetId,
      'path': path,
    });
    console.log('address params', params);

    const res = await axios.post('deriveShieldedAddress', params.toU8a());
    console.log('address res', res);
    let addressBytes = base64Decode(res.data.address);
    console.log('address bytes', addressBytes);

    return new MantaAssetShieldedAddress(addressBytes);
  }

  async _generateNextAddress(isInternal, assetId) {
    const chainId = isInternal ? INTERNAL_CHAIN_ID : EXTERNAL_CHAIN_ID;
    let addresses = store.get('mantaAddresses');
    const internalAddresses = addresses[chainId];
    const addressIdx = internalAddresses.length;
    const path = `${MANTA_WALLET_BASE_PATH}/${chainId}/${addressIdx}`;
    // Save that we have generated address
    internalAddresses.push(true);
    store.set('mantaAddresses', addresses);
    const address = this._deriveAddress(path, assetId);
    return address;
  }

  async generateNextInternalAddress(assetId) {
    return this._generateNextAddress(true, assetId);
  }

  async generateNextExternalAddress(assetId) {
    return this._generateNextAddress(false, assetId);
  }


  async generateMintAsset(assetId, amount) {
    this.generateNextInternalAddress(assetId);
    let addressIdx = store.get('mantaAddresses')[INTERNAL_CHAIN_ID].length - 1;
    const path = `${MANTA_WALLET_BASE_PATH}/${INTERNAL_CHAIN_ID}/${addressIdx}`;

    console.log('amount??', amount);

    const params = this.api.createType('GenerateAssetParams', {
      'asset_id': assetId,
      'path': path,
      'amount': amount.toArray('le', 16)
    });
    console.log('params', params);
    await axios.post('debugPrint', params.toU8a());

    const res = await axios.post('generateAsset', params.toU8a());
    console.log('asset res', res);
    let assetBytes = base64Decode(res.data.asset);
    console.log('asset bytes', assetBytes);

    let asset = new MantaAsset(assetBytes);
    console.log(asset, 'asset');
    return asset;
  }

  generateChangeAsset(assetId, amount) {
    this.generateNextInternalAddress(assetId);
    let addressIdx = store.get('mantaAddresses')[INTERNAL_CHAIN_ID].length - 1;
    const path =
    `${MANTA_WALLET_BASE_PATH}/${INTERNAL_CHAIN_ID}/${addressIdx}`;
    const secretKey = this.getSecretKey();
    const childSecret = this.wasm.generate_child_secret_key_for_browser(path, secretKey);
    const prngSeed = new Uint8Array(32);
    window.crypto.getRandomValues(prngSeed);
    return new MantaAsset(
      this.wasm.generate_change_asset_for_browser(
        childSecret, assetId, amount.toArray('le', 16), prngSeed
      )
    );
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
      changeAddress);
    return await this.wasm.generate_reclaim_payload_for_browser(
      asset1,
      asset2,
      ledgerState1,
      ledgerState2,
      reclaimAmount.toArray('le', 16),
      reclaimPK,
      changeAddress,
      prngSeed
    );
  }
}
