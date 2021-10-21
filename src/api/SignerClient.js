import { base64Decode, base64Encode } from '@polkadot/util-crypto';
import axios from 'axios';
import ClientAsset from 'types/ClientAsset';

export default class SignerClient {
  constructor(api) {
    axios.defaults.baseURL = 'http://localhost:29986/';
    this.api = api;
  }

  async signerDaemonIsRunning() {
    try {
      await axios.get('heartbeat', { timeout: 2 });
      return true;
    } catch (timeoutError) {
      return false;
    }
  }

  async recoverWallet(params) {
    const res = await axios.post('recoverAccount', params.toU8a());
    let bytes = base64Decode(res.data.recovered_account);
    const account = this.api.createType('RecoveredAccount', bytes);
    return account.assets.map((signerAsset) =>
      ClientAsset.fromSignerAsset(signerAsset)
    );
  }

  async deriveAddress(params) {
    const res = await axios.post('deriveShieldedAddress', params.toU8a());
    let addressBytes = base64Decode(res.data.address);
    return base64Encode(
      this.api.createType('MantaAssetShieldedAddress', addressBytes).toU8a()
    );
  }

  async generateAsset(params) {
    console.log(params, 'debug');
    const res = await axios.post('generateAsset', params.toU8a());
    let assetBytes = base64Decode(res.data.asset);
    return this.api.createType('MantaSignerInputAsset', assetBytes);
  }

  async generateMintPayload(params) {
    const res = await axios.post('generateMintData', params.toU8a());
    return base64Decode(res.data.mint_data);
  }

  async requestGeneratePrivateTransferPayloads(params) {
    const res = await axios.post(
      'requestGeneratePrivateTransferData',
      params.toU8a()
    );
    const decoded = this.api.createType(
      'PrivateTransferDataBatch',
      base64Decode(res.data.private_transfer_data)
    );
    return decoded.private_transfer_data_list.map((data) => data.toU8a());
  }

  async requestGenerateReclaimPayloads(params) {
    const res = await axios.post('requestGenerateReclaimData', params.toU8a());
    return this.api.createType(
      'ReclaimDataBatch',
      base64Decode(res.data.reclaim_data)
    );
  }
}
