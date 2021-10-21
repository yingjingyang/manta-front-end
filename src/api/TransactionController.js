import SimulatedLedgerState from 'types/SimulatedLedgerState';
import BN from 'bn.js';
import ClientAsset from 'types/ClientAsset';
import BrowserAddressStore from '../utils/persistence/BrowserAddressStore';
import SignerClient from './SignerClient';
import SignerParamGen from './SignerParamGen';

export default class TransactionController {
  constructor(api, addressStore = null) {
    this.transactions = [];
    this.api = api;
    this.ledgerState = new SimulatedLedgerState(api);
    this.signerClient = new SignerClient(api);
    this.signerParamGen = new SignerParamGen(api);
    this.addressStore = addressStore ?? new BrowserAddressStore();

    this.accumulatorInput = null;
  }

  async buildExternalPrivateTransferTxs(receivingAddress, coinSelection) {
    const mintZeroCoinTx = this._maybeBuildMintZeroCoinTx(coinSelection);

    // build params
    const transferParamsList = [
      ...(await this._buildInternalTransferParamsList(coinSelection)),
      await this._buildTerminalPrivateTransferParams(receivingAddress),
    ];
    const batchParams =
      await this.signerParamGen.generatePrivateTransferBatchParams(
        coinSelection.assetId,
        receivingAddress,
        transferParamsList
      );

    // build payloads
    const payloads =
      await this.signerClient.requestGeneratePrivateTransferPayloads(
        batchParams
      );

    // build transactions
    let transactions = payloads.map((payload) =>
      this.api.tx.mantaPay.privateTransfer(payload)
    );
    mintZeroCoinTx && transactions.unshift(mintZeroCoinTx);
    return transactions;
  }

  async buildReclaimTxs(coinSelection) {
    const mintZeroCoinTx = await this._maybeBuildMintZeroCoinTx(coinSelection);

    // build params
    let transferParamsList = await this._buildInternalTransferParamsList(
      coinSelection
    );
    let reclaimParams = await this._buildTerminalReclaimParams(coinSelection);
    const batchParams = await this.signerParamGen.generateReclaimBatchParams(
      coinSelection.assetId,
      transferParamsList,
      reclaimParams
    );

    // build payloads
    const payloads = await this.signerClient.requestGenerateReclaimPayloads(
      batchParams
    );

    // build transactions
    let privateTransfersTransactions = payloads.private_transfer_data_list.map(
      (payload) => this.api.tx.mantaPay.privateTransfer(payload)
    );
    const reclaimTransaction = this.api.tx.mantaPay.reclaim(
      payloads.reclaim_data
    );
    let transactions = [...privateTransfersTransactions, reclaimTransaction];
    mintZeroCoinTx && transactions.unshift(mintZeroCoinTx);

    return transactions;
  }

  async buildMintTx(assetId, value) {
    this._generateNextInternalAddress(assetId);
    const mintAssetkeypath = this.addressStore.getCurrentInternalKeypath();
    const mintAsset = new ClientAsset(assetId, value, mintAssetkeypath);
    console.log();
    const mintParams = this.signerParamGen.generateMintParams(mintAsset);
    console.log('mintParams', mintParams);
    const mintPayload = await this.signerClient.generateMintPayload(mintParams);
    const mintTx = this.api.tx.mantaPay.mintPrivateAsset(mintPayload);
    return mintTx;
  }

  async _maybeBuildMintZeroCoinTx(coinSelection) {
    if (!coinSelection.requiresZeroCoin()) return null;
    const zeroCoinAsset = await this._generateInternalAsset(
      coinSelection.assetId,
      new BN(0)
    );
    const mintZeroCoinPayload = await this.signerClient.generateMintPayload(
      zeroCoinAsset
    );
    const mintZeroCoinTx =
      this.api.tx.mantaPay.mintPrivateAsset(mintZeroCoinPayload);
    return mintZeroCoinTx;
  }

  async _buildInternalTransferParamsList(coinSelection) {
    const assetId = coinSelection.assetId;
    let paramsList = [];
    this.accumulatorInput = coinSelection.coins[0];
    for (let i = 1; i < coinSelection.coins.length - 1; i++) {
      let secondaryInput = coinSelection.coins[i];
      let totalValue = secondaryInput.value.add(this.accumulatorInput.value);
      let changeOutput = await this._generateInternalAsset(assetId, new BN(0));
      let accumulatorOutput = await this._generateInternalAsset(
        assetId,
        totalValue
      );
      await this._setOutputAssetShards(changeOutput, accumulatorOutput);
      let params = await this.signerParamGen.generatePrivateTransferParams(
        this.accumulatorInput,
        secondaryInput,
        changeOutput,
        accumulatorOutput
      );
      paramsList.push(params);
      this.accumulatorInput = accumulatorOutput;
    }
    return paramsList;
  }

  async _buildTerminalPrivateTransferParams(coinSelection) {
    const inputAsset1 = this.accumulatorInput;
    const inputAsset2 = coinSelection.last();
    let changeOutput = await this._generateInternalAsset(
      coinSelection.assetId,
      coinSelection.changeAmount
    );
    let nonChangeOutput = await this._generate_external_asset(new BN(0));
    let params = await this.signerParamGen.generatePrivateTransferParams(
      inputAsset1,
      inputAsset2,
      changeOutput,
      nonChangeOutput
    );
    return params;
  }

  async _buildTerminalReclaimParams(coinSelection) {
    const inputAsset1 = this.accumulatorInput;
    const inputAsset2 = coinSelection.last();
    let changeOutput = await this._generateInternalAsset(
      coinSelection.assetId,
      coinSelection.changeAmount
    );
    const params = await this.signerParamGen.generateReclaimParams(
      inputAsset1,
      inputAsset2,
      changeOutput
    );
    return params;
  }

  async _generateNextInternalAddress(assetId) {
    const keypath = this.addressStore.getNextInternalKeypath();
    console.log('_generateNextInternalAddress', keypath);
    const params = this.signerParamGen.generateAddressParams(assetId, keypath);
    console.log(params, 'address params');
    const address = await this.signerClient.deriveAddress(params);
    this.addressStore.saveInternalAddress(address);
    console.log();
  }

  async _generateInternalAsset(assetId, value) {
    this._generateNextInternalAddress(assetId);
    const keypath = this.addressStore.getCurrentInternalKeypath();
    const params = this.signerParamGen.generateAssetParams(
      assetId,
      keypath,
      value
    );
    const asset = await this.signerClient.generateAsset(params);
    return asset;
  }

  _generate_external_asset(assetId, value) {
    return new ClientAsset(assetId, value, null, null, null, null);
  }

  // Have to do this after both asset 1 and 2 have been added to simulated ledger state
  async _setOutputAssetShards(asset1, asset2) {
    this.ledgerState.addOffChainUTXO(asset1);
    this.ledgerState.addOffChainUTXO(asset2);
    const asset1Shard = await this.ledgerState.getShard(asset1.shardIndex);
    asset1.setShard(asset1Shard);
    const asset2Shard = await this.ledgerState.getShard(asset2.shardIndex);
    asset2.setShard(asset2Shard);
  }
}
