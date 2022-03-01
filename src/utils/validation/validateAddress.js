import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';
import { base58Encode, base58Decode } from '@polkadot/util-crypto';

export const validatePublicAddress = async (address) => {
  console.log('address', address);
  try {
    encodeAddress(
      isHex(address)
        ? hexToU8a(address)
        : decodeAddress(address)
    );
    console.log('valid');
    return true;
  } catch (error) {
    console.log('invalid');
    return false;
  }
};

export const validatePrivateAddress = async (address, api) => {
  try {
    base58Encode(
      api
        .createType('MantaAssetShieldedAddress', base58Decode(address))
        .toU8a()
    );
    return true;
  } catch (error) {
    return false;
  }
};
