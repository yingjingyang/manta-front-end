// import BN from 'bn.js';
// import getLedgerState from 'api/GetLedgerState';

// export const generateMintZeroCoinTx = async (assetId, signerClient, api) => {
//   const mintZeroCoinAsset = await signerClient.generateAsset(
//     assetId,
//     new BN(0)
//   );
//   const mintZeroCoinPayload = await signerClient.generateMintPayload(
//     mintZeroCoinAsset
//   );
//   const mintZeroCoinTx = api.tx.mantaPay.mintPrivateAsset(mintZeroCoinPayload);

//   return [mintZeroCoinAsset, mintZeroCoinTx];
// };

export const generateInternalTransferParams = async (
  coinSelection,
  signerClient,
  api
) => {
  const privateTransferParamsList = [];
  const intermediateAssets = [];
  // Build private transfers that accumulate assets within our internal chain until we have only two assets to send
  let accumulatorAsset = coinSelection.coins[0];

  for (let i = 1; i < coinSelection.coins.length - 1; i++) {
    let inputAsset = coinSelection.coins[i];

    let inputAssetledgerState = await getLedgerState(
      inputAsset,
      intermediateAssets,
      api
    );

    let accumulatorAssetLedgerState = await getLedgerState(
      accumulatorAsset,
      intermediateAssets,
      api
    );

    let [privateTransferParams, nextAccumulatorAsset] =
      await signerClient.generateIntermediatePrivateTransferParams(
        accumulatorAsset,
        inputAsset,
        accumulatorAssetLedgerState,
        inputAssetledgerState
      );

    intermediateAssets.push(nextAccumulatorAsset);
    accumulatorAsset = nextAccumulatorAsset;
    privateTransferParamsList.push(privateTransferParams);
  }
  return [privateTransferParamsList, intermediateAssets];
};

export const generateExternalTransferParamsList = async (
  receivingAddress,
  coinSelection,
  signerClient,
  api
) => {
  const [privateTransferParamsList, intermediateAssets] =
    await generateInternalTransferParams(coinSelection, signerClient, api);

  const secondLastAsset = coinSelection.coins[coinSelection.coins.length - 2];
  const accumulatorAsset =
    intermediateAssets[intermediateAssets.length - 1] || secondLastAsset;
  const accumulatorAssetLedgerState = await getLedgerState(
    accumulatorAsset,
    intermediateAssets,
    api
  );
  const lastAsset = coinSelection.coins[coinSelection.coins.length - 1];
  const lastAssetledgerState = await getLedgerState(
    lastAsset,
    intermediateAssets,
    api
  );
  const externalPrivateTransferParams =
    await signerClient.generateTerminalPrivateTransferParams(
      accumulatorAsset,
      lastAsset,
      accumulatorAssetLedgerState,
      lastAssetledgerState,
      coinSelection.targetAmount,
      coinSelection.changeAmount,
      receivingAddress
    );
  privateTransferParamsList.push(externalPrivateTransferParams);
  return privateTransferParamsList;
};

// export const generateReclaimParams = async (
//   reclaimAsset1,
//   reclaimAsset2,
//   intermediateAssets,
//   reclaimValue,
//   signerClient,
//   api
// ) => {
//   let ledgerState1 = await getLedgerState(
//     reclaimAsset1,
//     intermediateAssets,
//     api
//   );
//   let ledgerState2 = await getLedgerState(
//     reclaimAsset2,
//     intermediateAssets,
//     api
//   );
//   const reclaimParams = await signerClient.generateReclaimParams(
//     reclaimAsset1,
//     reclaimAsset2,
//     ledgerState1,
//     ledgerState2,
//     reclaimValue
//   );
//   return reclaimParams;
// };
