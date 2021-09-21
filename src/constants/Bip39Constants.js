import config from 'config';

export const BIP_44_PURPOSE_INDEX = 44;

export const DEFAULT_ACCOUNT_ID = 0;

export const EXTERNAL_CHAIN_ID = 0;
export const INTERNAL_CHAIN_ID = 1;

export const MANTA_WALLET_BASE_PATH = `m/${BIP_44_PURPOSE_INDEX}'/${config.COIN_TYPE_ID}'/${DEFAULT_ACCOUNT_ID}'`;
