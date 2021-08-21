// This component will simply add utility functions to your developer console.
import { Keyring } from '@polkadot/api';
import { useSubstrate } from '../';

export default function DeveloperConsole (props) {
  //
  const keyring2 = new Keyring();
  window.keyring2 = keyring2;
  //
  const { api, apiState, keyring, keyringState } = useSubstrate();
  if (apiState === 'READY') { window.api = api; }
  if (keyringState === 'READY') { window.keyring = keyring; }
  window.util = require('@polkadot/util');
  window.utilCrypto = require('@polkadot/util-crypto');

  return null;
}
