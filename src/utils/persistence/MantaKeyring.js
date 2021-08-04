import store from 'store';
import {
  mnemonicToMiniSecret,
  naclKeypairFromSeed
} from '@polkadot/util-crypto';
import BN from 'bn.js';
import MantaAsset from '../../dtos/MantaAsset';
import MantaAssetShieldedAddress from '../../dtos/MantaAssetShieldedAddress';
import MantaAssetReceiverSpendingInfo from '../../dtos/MantaAssetReceiverSpendingInfo';
import MantaEciesMessage from '../../dtos/MantaEciesMessage';
import _ from 'lodash';
import { loadSpendableAssets } from './AssetStorage';


const MIP_1_PURPOSE_INDEX = 3681947;
const GAP_LIMIT = 20;
export const EXTERNAL_CHAIN_ID = 1; // todo check
export const INTERNAL_CHAIN_ID = 0; // todo check
export const MANTA_WALLET_BASE_PATH = `//${MIP_1_PURPOSE_INDEX}`;

export default class MantaKeyring {

  constructor(api, wasm) {
    this.api = api;
    this.wasm = wasm
    if (!store.get('mantaAddresses')) {
      store.set('mantaAddresses', {[INTERNAL_CHAIN_ID]: [], [EXTERNAL_CHAIN_ID]: []});
    }
  }

  importMnemonic(mnemonic) {
    const seed = mnemonicToMiniSecret(mnemonic);
    const { secretKey } = naclKeypairFromSeed(seed);
    store.set('mantaSecretKey', secretKey);
    store.set('mantaAddresses', {[INTERNAL_CHAIN_ID]: [], [EXTERNAL_CHAIN_ID]: []});
  }

  hasSecretKey() {
    const key = this.getSecretKey()
    return key !== null;
  }

  getSecretKey() {
    return store.get('mantaSecretKey', null);
  }

  // recoverWallet(encryptedValues) {
  //   const internalChainAssets = this._recoverInternalChain(encryptedValues)
  //   console.log(internalChainAssets)
  //   console.log('@@@Test', _.isEqual(internalChainAssets, loadSpendableAssets()))
  //   // const externalChainAssets = _recoverExternalChain(encryptedValues)
  //   // return [...internalChainAssets, ...externalChainAssets]
  // }

  recoverWallet(encryptedValues, voidNumbers) {
    const internalPath = `${MANTA_WALLET_BASE_PATH}//${INTERNAL_CHAIN_ID}`
    const externalPath = `${MANTA_WALLET_BASE_PATH}//${EXTERNAL_CHAIN_ID}`
    let internalAddressEndIndex = GAP_LIMIT
    let externalAddressEndIndex = GAP_LIMIT
    let assets = [];

    encryptedValues.forEach(({encrypted_msg, ephemeral_pk}) => {
      const internalAsset = this._tryRecoverAssetFromSingleEncryptedMessage(
        internalAddressEndIndex, encrypted_msg, ephemeral_pk, internalPath
      )
      if (internalAsset) {
        assets.push(internalAsset)
        internalAddressEndIndex++;
      } else {
        const externalAsset = this._tryRecoverAssetFromSingleEncryptedMessage(
          externalAddressEndIndex, encrypted_msg, ephemeral_pk, externalPath
        )
        if (externalAsset) {
          assets.push(externalAsset)
          externalAddressEndIndex++;
        }
      }
    })
    const res = assets.filter(asset => !voidNumbers.includes(asset.voidNumber))
    console.log(res, 'assets')
    return res
  }

  _tryRecoverAssetFromSingleEncryptedMessage(addressEndIndex, encryptedMsg, ephemeralPk, basePath) {
    for (let i = 0; i < addressEndIndex; i++) {
      const path = `${basePath}//${i}`
      const childSecret = this.wasm.generate_child_secret_key_for_browser(path, this.getSecretKey())
      const ecsk = this.wasm.generate_ecsk_for_browser(childSecret)
      try {
        const decrypted = this.wasm.decrypt_ecies_for_browser(ecsk, ephemeralPk, encryptedMsg)
        const message = new MantaEciesMessage(decrypted)
        console.log('message', message)
        const asset = new MantaAsset(
          this.wasm.generate_mint_asset_for_browser(
          childSecret, message.assetId, message.amount.toArray('le', 16)
          )
        )
        console.log('DECRYPT SUCCESS!', decrypted)
        return asset
      } catch(error) {
        console.log('DECRYPT FAILED!', error)
      }
    }
  }

  // _recoverExternalChain(encryptedValues) {
  //   let addressIndex = 0
  //   const path = `${MANTA_WALLET_BASE_PATH}//${EXTERNAL_CHAIN_ID}//${addressIndex}`
  //   const ecsk = null;
  //   encryptedValues.forEach(({encrypted_msg, ephemeral_pk}) => {
  //     try {
  //       const decrypted = this._decryptEcies(ecsk, ephemeral_pk, encrypted_msg)
  //       console.log('DECRYPT SUCCESS!', decrypted)
  //     } catch(error) {
  //       console.log(error)
  //     }
  //   })
  // }

  _decryptEcies(ecsk, ecpk, ciphertext) {
    return this.wasm.decrypt_ecies_for_browser(
      ecsk, ecpk, ciphertext
    )
  }

  _deriveAddress(path, assetId) {
    console.log('deriving address with path:', path)
    const secretKey = this.getSecretKey(); // todo: get from storage
    const childSecret = this.wasm.generate_child_secret_key_for_browser(path, secretKey);
    const address = this.wasm.generate_shielded_address_for_browser(childSecret, assetId)
    return new MantaAssetShieldedAddress(address);
  }

  _generateNextAddress(isInternal, assetId) {
    const chainId = isInternal ? INTERNAL_CHAIN_ID : EXTERNAL_CHAIN_ID;
    let addresses = store.get('mantaAddresses');
    const internalAddresses = addresses[chainId];
    const addressIdx = internalAddresses.length;
    const path = `${MANTA_WALLET_BASE_PATH}//${chainId}//${addressIdx}`;
    // Save that we have generated address
    internalAddresses.push(true);
    store.set('mantaAddresses', addresses);
    const address = this._deriveAddress(path, assetId);
    return address;
  }

  generateNextInternalAddress(assetId) {
    return this._generateNextAddress(true, assetId);
  }

  generateNextExternalAddress(assetId) {
    return this._generateNextAddress(false, assetId);
  }

  generateMintAsset(assetId, amount) {
    const secretKey = this.getSecretKey();
    this.generateNextInternalAddress(assetId);
    let addressIdx = store.get('mantaAddresses')[INTERNAL_CHAIN_ID].length - 1;
    const path = `${MANTA_WALLET_BASE_PATH}//${INTERNAL_CHAIN_ID}//${addressIdx}`;
    const childSecret = this.wasm.generate_child_secret_key_for_browser(path, secretKey);
    return new MantaAsset(
      this.wasm.generate_mint_asset_for_browser(
        childSecret, assetId, amount.toArray('le', 16)
      )
    );
  }

  generateChangeAsset(assetId, amount) {
    this.generateNextInternalAddress(assetId);
    let addressIdx = store.get('mantaAddresses')[INTERNAL_CHAIN_ID].length - 1;
    const path =
    `${MANTA_WALLET_BASE_PATH}//${INTERNAL_CHAIN_ID}//${addressIdx}`;
    const secretKey = this.getSecretKey()
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
      changeAddress)
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
