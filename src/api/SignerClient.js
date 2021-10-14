import {
  MANTA_WALLET_BASE_PATH,
  INTERNAL_CHAIN_ID,
  EXTERNAL_CHAIN_ID,
} from 'constants/Bip39Constants';
import store from 'store';
import { base64Decode, base64Encode } from '@polkadot/util-crypto';
import axios from 'axios';
import BN from 'bn.js';

export default class SignerClient {
  constructor(api) {
    axios.defaults.baseURL = 'http://localhost:29986/';
    this.api = api;
    if (!store.get('mantaAddresses')) {
      store.set('mantaAddresses', {
        [INTERNAL_CHAIN_ID]: [],
        [EXTERNAL_CHAIN_ID]: [],
      });
    }
  }

  async checkSignerIsOpen() {
    try {
      await axios.get('heartbeat', { timeout: 2 });
      return true;
    } catch (timeoutError) {
      return false;
    }
  }

  async getAllEncryptedNotes() {
    let storage = await this.api.query.mantaPay.ledgerShards.entries();
    return storage.map((storageItem) => storageItem[1][1]);
  }

  async getAllVoidNumbers() {
    let storage = await this.api.query.mantaPay.voidNumbers.entries();
    return storage.map((storageItem) => storageItem[0]);
  }

  async getAllUTXOs() {
    let storage = await this.api.query.mantaPay.ledgerShards.entries();
    return storage.map((storageItem) => storageItem[1][0]);
  }

  async recoverWallet() {
    const encryptedNotes = await this.getAllEncryptedNotes();
    const voidNumbers = await this.getAllVoidNumbers();
    const utxos = await this.getAllUTXOs();
    const params = this.api.createType('RecoverAccountParams', {
      encrypted_notes: encryptedNotes,
      void_numbers: voidNumbers,
      utxos: utxos,
    });
    const res = await axios.post('recoverAccount', params.toU8a());
    let bytes = base64Decode(res.data.recovered_account);
    const account = this.api.createType('RecoveredAccount', bytes);
    return account.assets;
  }

  async _deriveAddress(keypath, assetId) {
    const params = this.api.createType('DeriveShieldedAddressParams', {
      asset_id: assetId,
      keypath: keypath,
    });
    const res = await axios.post('deriveShieldedAddress', params.toU8a());
    let addressBytes = base64Decode(res.data.address);
    return base64Encode(
      this.api.createType('MantaAssetShieldedAddress', addressBytes).toU8a()
    );
  }

  async _generateNextAddress(isInternal, assetId) {
    const chainId = isInternal ? INTERNAL_CHAIN_ID : EXTERNAL_CHAIN_ID;
    let addresses = store.get('mantaAddresses');
    const chainAddresses = addresses[chainId];
    const addressIdx = chainAddresses.length;
    const keypath = `${MANTA_WALLET_BASE_PATH}/${chainId}/${addressIdx}`;

    const address = this._deriveAddress(keypath, assetId);
    chainAddresses.push(address);
    store.set('mantaAddresses', addresses);
    return address;
  }

  async generateNextInternalAddress(assetId) {
    return this._generateNextAddress(true, assetId);
  }

  async generateNextExternalAddress(assetId) {
    return this._generateNextAddress(false, assetId);
  }

  getCurrentInternalKeypath() {
    let addressIdx = store.get('mantaAddresses')[INTERNAL_CHAIN_ID].length - 1;
    return `${MANTA_WALLET_BASE_PATH}/${INTERNAL_CHAIN_ID}/${addressIdx}`;
  }

  async generateAsset(assetId, amount) {
    await this.generateNextInternalAddress(assetId);
    const keypath = this.getCurrentInternalKeypath();
    const params = this.api.createType('GenerateAssetParams', {
      asset_id: assetId,
      keypath: keypath,
      value: amount,
    });
    const res = await axios.post('generateAsset', params.toU8a());
    let assetBytes = base64Decode(res.data.asset);
    return this.api.createType('MantaSignerInputAsset', assetBytes);
  }

  async generateMintPayload(asset) {
    const params = this.api.createType('GenerateAssetParams', {
      asset_id: asset.asset_id,
      keypath: asset.keypath,
      value: asset.value,
    });
    const res = await axios.post('generateMintData', params.toU8a());
    return base64Decode(res.data.mint_data);
  }

  async generateIntermediatePrivateTransferParams(
    accumulatorAsset,
    inputAsset,
    accumulatorAssetledgerState,
    inputAssetledgerState
  ) {
    const assetId = accumulatorAsset.asset_id;
    const accumulatedAmount = accumulatorAsset.value.add(inputAsset.value);
    const nextAccumulatorAsset = await this.generateAsset(
      assetId,
      accumulatedAmount
    );
    const accumulatorKeypath = this.getCurrentInternalKeypath();

    await this.generateNextInternalAddress(assetId);
    const changeKeypath = this.getCurrentInternalKeypath();

    const params = this.api.createType('GeneratePrivateTransferParams', {
      asset_id: assetId,
      asset_1_value: accumulatorAsset.value,
      asset_2_value: inputAsset.value,
      asset_1_keypath: accumulatorAsset.keypath,
      asset_2_keypath: inputAsset.keypath,
      asset_1_shard: accumulatorAssetledgerState,
      asset_2_shard: inputAssetledgerState,
      change_output_keypath: changeKeypath,
      non_change_output_keypath: accumulatorKeypath,
      non_change_output_value: accumulatedAmount,
      change_output_value: new BN(0),
    });
    return [params.toU8a(), nextAccumulatorAsset];
  }

  async generateTerminalPrivateTransferParams(
    asset1,
    asset2,
    ledgerState1,
    ledgerState2,
    spendAmount,
    changeAmount,
    receivingAddress
  ) {
    await this.generateNextInternalAddress(asset1.asset_id);
    const changeKeypath = this.getCurrentInternalKeypath();
    let someReceivingAddress = this.api.createType(
      'MantaAssetShieldedAddress',
      base64Decode(receivingAddress)
    );
    someReceivingAddress = this.api.createType(
      'Option<MantaAssetShieldedAddress>',
      someReceivingAddress
    );
    const params = this.api.createType('GeneratePrivateTransferParams', {
      asset_id: asset1.asset_id,
      asset_1_value: asset1.value,
      asset_2_value: asset2.value,
      asset_1_keypath: asset1.keypath,
      asset_2_keypath: asset2.keypath,
      asset_1_shard: ledgerState1,
      asset_2_shard: ledgerState2,
      change_output_keypath: changeKeypath,
      receiving_address: someReceivingAddress,
      non_change_output_value: spendAmount,
      change_output_value: changeAmount,
    });
    return params.toU8a();
  }

  async requestGeneratePrivateTransferPayloads(privateTransferParamsList) {
    const privateTransferParamsBatch = this.api.createType(
      'GeneratePrivateTransferBatchParams',
      {
        private_transfer_params_list: privateTransferParamsList,
      }
    );
    const res = await axios.post(
      'requestGeneratePrivateTransferData',
      privateTransferParamsBatch.toU8a()
    );
    const decoded = this.api.createType(
      'PrivateTransferDataBatch',
      base64Decode(res.data.private_transfer_data)
    );
    return decoded.private_transfer_data_list.map((data) => data.toU8a());
  }

  async generateReclaimParams(
    asset1,
    asset2,
    ledgerState1,
    ledgerState2,
    reclaimValue
  ) {
    this.generateNextInternalAddress(asset1.asset_id);
    let changeAddressIdx =
      store.get('mantaAddresses')[INTERNAL_CHAIN_ID].length - 1;
    const changeKeypath = `${MANTA_WALLET_BASE_PATH}/${INTERNAL_CHAIN_ID}/${changeAddressIdx}`;
    const params = this.api.createType('GenerateReclaimParams', {
      asset_id: asset1.asset_id,
      input_asset_1_value: asset1.value,
      input_asset_2_value: asset2.value,
      input_asset_1_keypath: asset1.keypath,
      input_asset_2_keypath: asset2.keypath,
      input_asset_1_shard: ledgerState1,
      input_asset_2_shard: ledgerState2,
      change_keypath: changeKeypath,
      reclaim_value: reclaimValue,
    });
    return params.toU8a();
  }

  async requestGenerateReclaimPayloads(
    reclaimParams,
    privateTransferParamsList
  ) {
    const reclaimParamsBatch = this.api.createType(
      'GenerateReclaimBatchParams',
      {
        reclaim_params: reclaimParams,
        private_transfer_params_list: privateTransferParamsList,
      }
    );
    const res = await axios.post(
      'requestGenerateReclaimData',
      reclaimParamsBatch.toU8a()
    );
    return this.api.createType(
      'ReclaimDataBatch',
      base64Decode(res.data.reclaim_data)
    );
  }
}
