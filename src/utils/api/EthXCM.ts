// @ts-nocheck
import { ethers } from 'ethers';
import Xtokens from 'eth/Xtokens.json';
import Chain from 'types/Chain';
import { addressToAccountId } from './XCM';
import { hexStripPrefix } from '@polkadot/util';

// Same for Moonbeam, Moonriver, Moonbase
const ERC_PRECOMPILE_ADDRESS = '0x0000000000000000000000000000000000000802';
const XTOKENS_PRECOMPILE_ADDRESS = '0x0000000000000000000000000000000000000804';

const XTOKENS_PRECOMPILE_PARACHAIN_SELECTOR = '0x00';
const XTOKENS_PRECOMPILE_ACCOUNT_ID_32_SELECTOR = '0x01';
const XTOKENS_PRECOMPILE_NETWORK_ANY_SUFFIX  = '00';

const u32ToHex = (value) => {
  return ('00000000' + value.toString(16).toUpperCase()).slice(-8);
};

const getXtokensPrecompileLocation = (destinationParachainId, accountId) => {
  return [
    1,
    getXtokensPrecompileInterior(destinationParachainId, accountId)
  ];
};

const getXtokensPrecompileInterior = (destinationParachainId, accountId) => {
  return [
    getXtokensPrecompileParachainId(destinationParachainId),
    getXtokensPrecompileAccountId32(accountId)
  ];
};

const getXtokensPrecompileParachainId = (destinationParachainId) => {
  return XTOKENS_PRECOMPILE_PARACHAIN_SELECTOR + u32ToHex(destinationParachainId);
};

const getXtokensPrecompileAccountId32 = (accountId) => {
  return (
    XTOKENS_PRECOMPILE_ACCOUNT_ID_32_SELECTOR
    + hexStripPrefix(accountId)
    + XTOKENS_PRECOMPILE_NETWORK_ANY_SUFFIX
  );
};

export const transferMovrFromMoonriverToDolphin = async (provider, balance, address) => {
  console.log('address', address);
  const abi = Xtokens.abi;
  const ethersProvider = new ethers.providers.Web3Provider(provider);
  const signer = ethersProvider.getSigner();
  const contract = new ethers.Contract(XTOKENS_PRECOMPILE_ADDRESS, abi, signer);
  const amount = balance.valueAtomicUnits.toString();
  const accountId = addressToAccountId(address);
  const destination = getXtokensPrecompileLocation(Chain.Dolphin().parachainId, accountId);
  const weight = Chain.Calamari().destinationWeight.toString();

  try {
    console.log('params', contract, amount, destination, weight);
    const createReceipt = await contract.transfer(ERC_PRECOMPILE_ADDRESS, amount, destination, weight);
    await createReceipt.wait();
    console.log(`Tx successful with hash: ${createReceipt.hash}`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
