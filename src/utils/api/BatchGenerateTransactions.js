import BN from 'bn.js';

export const generateMintZeroCoinTx = async (assetId, signerClient, api) => {
  const mintZeroCoinAsset = await signerClient.generateAsset(
    assetId,
    new BN(0)
  );
  const mintZeroCoinPayload = await signerClient.generateMintPayload(
    mintZeroCoinAsset
  );
  const mintZeroCoinTx = api.tx.mantaPay.mintPrivateAsset(mintZeroCoinPayload);

  return [mintZeroCoinAsset, mintZeroCoinTx];
};

const batchGenerateTransactionParameters = async (
  coinSelection,
  generateParamsFn
) => {
  const paramsList = [];
  const INPUTS_PER_TRANSFER = 2;
  for (let i = 0; i < coinSelection.length; i += INPUTS_PER_TRANSFER) {
    const inputAsset1 = coinSelection[i];
    const inputAsset2 = coinSelection[i + 1];
    const params = await generateParamsFn(inputAsset1, inputAsset2);
    paramsList.push(params);
  }
  return paramsList;
};

export const batchGenerateTransactions = async (
  coinSelection,
  generateParamsFn,
  generatePayloadsFunction,
  generateTxFunction,
  signerClient,
  api
) => {
  let transactions = [];
  if (coinSelection.length % 2 === 1) {
    const [mintZeroCoinAsset, mintZeroCoinTx] = await generateMintZeroCoinTx(
      coinSelection[0].assetId,
      signerClient,
      api
    );
    transactions.push(mintZeroCoinTx);
    coinSelection.push(mintZeroCoinAsset);
  }
  const paramsList = await batchGenerateTransactionParameters(
    coinSelection,
    generateParamsFn
  );
  const payloads = await generatePayloadsFunction(paramsList);
  payloads.forEach((payload) => {
    transactions.push(generateTxFunction(payload));
  });
  return transactions;
};
