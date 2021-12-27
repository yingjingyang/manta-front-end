import { BrowserSignerInterfaceConfig } from 'signer-interface';
import config from 'config';

const signerInterfaceConfig = new BrowserSignerInterfaceConfig(
  config.BIP_44_COIN_TYPE_ID,
  config.SIGNER_URL,
  config.BASE_STORAGE_KEY,
);

export default signerInterfaceConfig;
