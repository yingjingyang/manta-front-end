import BN from 'bn.js';

export default class SignerParamGen {
  constructor(api) {
    this.api = api;
  }

  generateAssetParams(assetId, keypath, value) {
    return this.api.createType('GenerateAssetParams', {
      asset_id: assetId,
      keypath: keypath,
      value: value,
    });
  }

  generateMintParams(asset) {
    return this.api.createType('GenerateAssetParams', {
      asset_id: asset.assetId,
      keypath: asset.keypath,
      value: asset.value,
    });
  }

  generateAddressParams(assetId, keypath) {
    console.log(keypath, assetId, 'dwjkddkjdhw');
    return this.api.createType('DeriveShieldedAddressParams', {
      asset_id: assetId,
      keypath: keypath,
    });
  }

  generatePrivateTransferParams(
    inputAsset1,
    inputAsset2,
    changeOutputAsset,
    nonChangeOutputAsset
  ) {
    const params = this.api.createType('GeneratePrivateTransferParams', {
      asset_id: inputAsset1.assetId,
      asset_1_value: inputAsset1.value,
      asset_2_value: inputAsset2.value,
      asset_1_keypath: inputAsset1.keypath,
      asset_2_keypath: inputAsset2.keypath,
      asset_1_shard: inputAsset1.ledgerState,
      asset_2_shard: inputAsset2.ledgerState,
      change_output_keypath: changeOutputAsset.keypath,
      non_change_output_keypath: nonChangeOutputAsset.keypath,
      non_change_output_value: nonChangeOutputAsset.value,
      change_output_value: new BN(0),
    });
    return params.toU8a();
  }

  generateReclaimParams(
    reclaimInputAsset1,
    reclaimInputAsset2,
    changeOutputAsset
  ) {
    const totalValue = reclaimInputAsset1.value.add(reclaimInputAsset2.value);
    const reclaimValue = totalValue.sub(changeOutputAsset.value);

    const params = this.api.createType('GenerateReclaimParams', {
      asset_id: reclaimInputAsset1.assetId,
      input_asset_1_value: reclaimInputAsset1.value,
      input_asset_2_value: reclaimInputAsset2.value,
      input_asset_1_keypath: reclaimInputAsset1.keypath,
      input_asset_2_keypath: reclaimInputAsset2.keypath,
      input_asset_1_shard: reclaimInputAsset1.shard,
      input_asset_2_shard: reclaimInputAsset2.shard,
      change_keypath: changeOutputAsset.keypath,
      reclaim_value: reclaimValue,
    });
    return params.toU8a();
  }

  generatePrivateTransferBatchParams(
    assetId,
    receivingAddress,
    privateTransferParamsList
  ) {
    const params = this.api.createType('GeneratePrivateTransferBatchParams', {
      asset_id: assetId,
      receiving_address: receivingAddress,
      private_transfer_params_list: privateTransferParamsList,
    });
    return params.toU8a();
  }

  generateReclaimBatchParams(
    assetId,
    privateTransferParamsList,
    reclaimParams
  ) {
    const params = this.api.createType('GeneratePrivateTransferBatchParams', {
      asset_id: assetId,
      private_transfer_params_list: privateTransferParamsList,
      reclaim_params: reclaimParams,
    });
    return params.toU8a();
  }

  async generateRecoverWalletParams() {
    const encryptedNotes = await this._getAllEncryptedNotes();
    const voidNumbers = await this._getAllVoidNumbers();
    const utxos = await this._getAllUTXOs();
    return this.api.createType('RecoverAccountParams', {
      encrypted_notes: encryptedNotes,
      void_numbers: voidNumbers,
      utxos: utxos,
    });
  }

  async _getAllEncryptedNotes() {
    let storage = await this.api.query.mantaPay.ledgerShards.entries();
    return storage.map((storageItem) => storageItem[1][1]);
  }

  async _getAllVoidNumbers() {
    let storage = await this.api.query.mantaPay.voidNumbers.entries();
    const res = storage.map((storageItem) => storageItem[0].args).flat();
    return res;
  }

  async _getAllUTXOs() {
    let storage = await this.api.query.mantaPay.ledgerShards.entries();
    return storage.map((storageItem) => storageItem[1][0]);
  }
}
