// import MintData from './dtos/MintData';
// import { ApiPromise, WsProvider } from '@polkadot/api';
// import config from '../config';

// export const setup = async () => {
//   const wsProvider = new WsProvider(config.PROVIDER_SOCKET);
//   const api = await ApiPromise.create({ provider: wsProvider });
//   return api;
// };

// const extrinsicSucceeded = (extrinsic, blockHash) => true;

// const getPrivateBalances = async (myAddresses, startingBlockNumber) => {
//   const BATCH_SIZE = 100;
//   const balanceByAssetId = {};
//   let blockNumber = startingBlockNumber;
//   while (blockNumber <= startingBlockNumber + BATCH_SIZE) { // currentBlockNumber) {
//     const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
//     const signedBlock = await api.rpc.chain.getBlock(blockHash);
//     signedBlock.block.extrinsics
//       .filter(extrinsic => myAddresses.includes(extrinsic.signer.toString()))
//       .filter(extrinsic => extrinsic.method._meta.name.toString() === 'mint_private_asset')
//       .filter(extrinsic => extrinsicSucceeded(extrinsic, blockHash))
//       .map(extrinsic => new MintData(extrinsic.method.args[0]))
//       .forEach((mintData) => {
//         balanceByAssetId[mintData.assetID] = mintData.mintAmount;
//       });

//     blockNumber = blockNumber + 1;
//   }
//   return balanceByAssetId;
// };

// onmessage = async function (e) {
//   const api = await setup();
//   postMessage('pong');
// };
