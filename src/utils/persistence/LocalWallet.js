import store from 'store';
import { Keyring } from '@polkadot/api';

// see https://github.com/Manta-Network/MIPS/pull/2/files

const MIP_1_PURPOSE_INDEX = 3681947;
export const EXTERNAL_CHAIIN_ID = 1; // todo check
export const INTERNAL_CHAIN_ID = 0; // todo check
// todo: remove
export const DEV_SEED = '0x0000000000000000000000000000000000000000000000000000000000000000';
export const MANTA_WALLET_BASE_PATH = `${DEV_SEED}//${MIP_1_PURPOSE_INDEX}}`; // /cointype/change/address

export const DEFAULT_GAP_LIMIT = 20;
export const GapLimitExceeded = Error();



export const LocalWallet = {

  init: () => {
    if (!store.get('manta_addresses')) {
      store.set('manta_addresses', {});
    }
  },

  getAddressesByAssetId: assetId => {
    const addresses = store.get('manta_addresses', {});
    addresses[assetId] ?? {};
  },

  getExternalAddressesByAssetId: assetId => {
    const addresses = this.getAddressesByAssetId(assetId);
    addresses[EXTERNAL_CHAIIN_ID] ?? [];
  },

  getInternalAddressesByAssetId: assetId => {
    const addresses = this.getAddressesByAssetId(assetId);
    addresses[INTERNAL_CHAIN_ID] ?? [];
  },

  setExternalAddressesByAssetId: (assetId, addresses) => {
    const storedAddresses = store.get('manta_addresses', {});
    storedAddresses[assetId][EXTERNAL_CHAIIN_ID] = addresses;
    store.set('manta_addresses', storedAddresses);
  },

  setInternalAddressesByAssetId: (assetId, addresses) => {
    const storedAddresses = store.get('manta_addresses', {});
    storedAddresses[assetId][INTERNAL_CHAIN_ID] = addresses;
    store.set('manta_addresses', storedAddresses);
  },

  pushExternalAddress: (assetId, address) => {
    const addresses = getExternalAddressesByAssetId(assetId);
    addresses.push(address);
    setExternalAddressesByAssetId(assetId, addresses);
  },

  pushInternalAddress: (assetId, address) => {
    const addresses = getInternalAddressesByAssetId(assetId);
    addresses.push(address);
    setInternalAddressesByAssetId(assetId, addresses);
  },

  deriveNextInternalAddress: assetId => {
    const externalOffset = this.getExternalAddressesByAssetId(assetId).length;
    const keyPath = `${MANTA_WALLET_BASE_PATH}//${EXTERNAL_CHAIIN_ID}//${externalOffset + 1}`;
    const keyring = new Keyring();
    const keypair = keyring.addFromUri(keyPath);
    const address = keypair.derive(keyPath);
    this.pushExternalAddress(assetId, address);
    return address;
  },

  deriveNextExternalAddress: assetId => {
    const externalOffset = this.getExternalAddressesByAssetId(assetId).length;
    const keyPath = `${MANTA_WALLET_BASE_PATH}//${EXTERNAL_CHAIIN_ID}//${externalOffset + 1}`;
    const keyring = new Keyring();
    const keypair = keyring.addFromUri(keyPath);
    const address = keypair.derive(keyPath);
    this.pushExternalAddress(assetId, address);
    return address;
  },

  // getExternalAddress: (assertId, addressIdx) => {
  //   const keyring2 = new Keyring();

  // },

  // getInternalAddress: (assertId, addressIdx) => {
  //   const keyring2 = new Keyring();
  // }

};
