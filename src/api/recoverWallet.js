import SignerClient from './SignerClient';
import SignerParamGen from './SignerParamGen';

export default async function recoverWallet(api) {
  const signerParamGen = new SignerParamGen(api);
  const signerClient = new SignerClient(api);
  const params = this.signerParamGen.generateRecoverWalletParams();
  const recoveredWallet = await this.signerClient.recoverWallet(params);
  return recoveredWallet;
}
