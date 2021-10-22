import {
  MANTA_WALLET_BASE_PATH,
  INTERNAL_CHAIN_ID,
  EXTERNAL_CHAIN_ID,
} from 'constants/Bip39Constants';
import store from 'store';

// todo: general address store with these methods
// low level address store that only loads and sets addresses of both chains (4 methods)
export default class BrowserAddressStore {
  loadInternalAddresses() {
    return this._loadAddresses(true)[INTERNAL_CHAIN_ID];
  }

  loadExternalAddresses() {
    return this._loadAddresses(false)[EXTERNAL_CHAIN_ID];
  }

  saveInternalAddress(address) {
    this._saveAddress(true, address);
  }

  saveExternalAddress(address) {
    this._saveAddress(false, address);
  }

  rollBackInternalAddresses(numberOfAddresses) {
    let internalAddresses = this.loadInternalAddresses();
    for (let i = 0; i < numberOfAddresses; i++) {
      internalAddresses.pop();
    }
    let addresses = this._loadAddresses();
    addresses[INTERNAL_CHAIN_ID] = internalAddresses;
    store.set('mantaAddresses', addresses);
  }

  getNextInternalKeypath() {
    let addressIdx = store.get('mantaAddresses')[INTERNAL_CHAIN_ID].length;
    return `${MANTA_WALLET_BASE_PATH}/${INTERNAL_CHAIN_ID}/${addressIdx}`;
  }

  getCurrentInternalKeypath() {
    let addressIdx = store.get('mantaAddresses')[INTERNAL_CHAIN_ID].length - 1;
    return `${MANTA_WALLET_BASE_PATH}/${INTERNAL_CHAIN_ID}/${addressIdx}`;
  }

  getNextExternalKeypath() {
    let addressIdx = store.get('mantaAddresses')[EXTERNAL_CHAIN_ID].length;
    return `${MANTA_WALLET_BASE_PATH}/${EXTERNAL_CHAIN_ID}/${addressIdx}`;
  }

  _loadAddresses() {
    return store.get('mantaAddresses');
  }

  // todo: simplify, this is so dumb
  _saveAddress(isInternal, address) {
    let addresses = store.get('mantaAddresses');
    const chainId = isInternal ? INTERNAL_CHAIN_ID : EXTERNAL_CHAIN_ID;
    const chainAddresses = addresses[chainId];
    chainAddresses.push(address);
    store.set('mantaAddresses', addresses);
  }
}
