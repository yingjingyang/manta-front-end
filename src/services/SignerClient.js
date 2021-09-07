import store from 'store';
import { base64Decode } from '@polkadot/util-crypto';
import config from 'config';
import axios from 'axios';
import MantaUIAsset from 'types/MantaUIAsset';
import MantaAssetShieldedAddress from 'types/MantaAssetShieldedAddress';
import { persistSpendableAssets } from 'utils/persistence/AssetStorage';

const BIP_44_PURPOSE_INDEX = 44;

const DEFAULT_ACCOUNT_ID = 0;

export const EXTERNAL_CHAIN_ID = 0;
export const INTERNAL_CHAIN_ID = 1;

export const MANTA_WALLET_BASE_PATH = `m/${BIP_44_PURPOSE_INDEX}'/${config.COIN_TYPE_ID}'/${DEFAULT_ACCOUNT_ID}'`;
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

  async recoverWallet() {
    const encryptedNotes = await this.api.query.mantaPay.encValueList();
    const voidNumbers = await this.api.query.mantaPay.vNList();
    const shards = await this.api.query.mantaPay.coinShards();
    const utxos = shards.shard.map((shard) => shard.list).flat();
    const params = this.api.createType('RecoverAccountParams', {
      encrypted_notes: encryptedNotes,
      void_numbers: voidNumbers,
      utxos: utxos,
    });
    const res = await axios.post('recoverAccount', params.toU8a());
    let bytes = base64Decode(res.data.recovered_account);
    const recoveredAssetsRaw = this.api.createType('RecoveredAccount', bytes);
    const recoveredAssets = recoveredAssetsRaw.assets.map((asset) =>
      MantaUIAsset.fromBytes(asset.toU8a(), this.api)
    );
    persistSpendableAssets(recoveredAssets);
  }

  async _deriveAddress(path, assetId) {
    const params = this.api.createType('DeriveShieldedAddressParams', {
      asset_id: assetId,
      path: path,
    });
    const res = await axios.post('deriveShieldedAddress', params.toU8a());
    let addressBytes = base64Decode(res.data.address);
    return new MantaAssetShieldedAddress(addressBytes);
  }

  async _generateNextAddress(isInternal, assetId) {
    const chainId = isInternal ? INTERNAL_CHAIN_ID : EXTERNAL_CHAIN_ID;
    let addresses = store.get('mantaAddresses');
    const chainAddresses = addresses[chainId];
    const addressIdx = chainAddresses.length;
    const path = `${MANTA_WALLET_BASE_PATH}/${chainId}/${addressIdx}`;

    const address = this._deriveAddress(path, assetId);
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

  async generateAsset(assetId, amount) {
    await this.generateNextInternalAddress(assetId);
    let addressIdx = store.get('mantaAddresses')[INTERNAL_CHAIN_ID].length - 1;
    const path = `${MANTA_WALLET_BASE_PATH}/${INTERNAL_CHAIN_ID}/${addressIdx}`;
    const params = this.api.createType('GenerateAssetParams', {
      asset_id: assetId,
      path: path,
      value: amount,
    });
    const res = await axios.post('generateAsset', params.toU8a());
    let assetBytes = base64Decode(res.data.asset);
    return MantaUIAsset.fromBytes(assetBytes, this.api);
  }

  async generateMintPayload(asset) {
    const params = this.api.createType('GenerateAssetParams', {
      asset_id: asset.assetId,
      path: asset.path,
      value: asset.value,
    });
    const res = await axios.post('generateMintData', params.toU8a());
    return base64Decode(res.data.mint_data);
  }

  async generatePrivateTransferPayload(
    asset1,
    asset2,
    ledgerState1,
    ledgerState2,
    receivingAddress,
    spendAmount,
    changeAmount
  ) {
    this.generateNextInternalAddress(asset1.assetId);
    let changeAddressIdx =
      store.get('mantaAddresses')[INTERNAL_CHAIN_ID].length - 1;
    const changePath = `${MANTA_WALLET_BASE_PATH}/${INTERNAL_CHAIN_ID}/${changeAddressIdx}`;

    const params = this.api.createType('GeneratePrivateTransferDataParams', {
      asset_id: asset1.assetId,
      asset_1_value: asset1.value,
      asset_2_value: asset2.value,
      asset_1_path: asset1.path,
      asset_2_path: asset2.path,
      asset_1_shard: ledgerState1,
      asset_2_shard: ledgerState2,
      receiving_address: receivingAddress,
      change_path: changePath,
      non_change_output_value: spendAmount,
      change_output_value: changeAmount,
    });
    const res = await axios.post('generatePrivateTransferData', params.toU8a());
    return base64Decode(res.data.private_transfer_data);
  }

  async generateReclaimPayload(
    asset1,
    asset2,
    ledgerState1,
    ledgerState2,
    reclaimValue
  ) {
    this.generateNextInternalAddress(asset1.assetId);
    let changeAddressIdx =
      store.get('mantaAddresses')[INTERNAL_CHAIN_ID].length - 1;
    const changePath = `${MANTA_WALLET_BASE_PATH}/${INTERNAL_CHAIN_ID}/${changeAddressIdx}`;
    const params = this.api.createType('GenerateReclaimDataParams', {
      asset_id: asset1.assetId,
      asset_1_value: asset1.value,
      asset_2_value: asset2.value,
      asset_1_path: asset1.path,
      asset_2_path: asset2.path,
      asset_1_shard: ledgerState1,
      asset_2_shard: ledgerState2,
      change_path: changePath,
      reclaim_value: reclaimValue,
    });
    console.log('!!', asset1, asset2, ledgerState1, ledgerState2, reclaimValue);

    const res = await axios.post('generateReclaimData', params.toU8a());
    return base64Decode(res.data.reclaim_data);
  }
}
