// @ts-nocheck
import Svgs from 'resources/icons';
import BN from 'bn.js';
import config from 'config';


const DolphinAssetIds = {
  DOL: 1,
  KAR: 8,
  AUSD: 9,
  LKSM: 10,
  ROC: 11,
  KBTC: 12,
  MOVR: 13,
  PHA: 14,
  RASTR: 16
}

const CalamariAssetIds = {
  KMA: 1,
  KAR: 8,
  AUSD: 9,
  LKSM: 10,
  MOVR: 11,
  KSM: 12,
  PHA: 13
}

const AssetIds = config.NETWORK_NAME === 'Calamari' ? CalamariAssetIds : DolphinAssetIds;

export default class AssetType {
  constructor(
    assetId,
    baseName,
    baseTicker,
    icon,
    numberOfDecimals,
    publicExistentialDeposit,
    isPrivate,
    isNativeToken
  ) {
    this.assetId = assetId;
    this.baseName = baseName;
    this.baseTicker = baseTicker;
    this.name = AssetType._getFullName(baseName, isPrivate);
    this.ticker = AssetType._getFullTicker(baseTicker, isPrivate);
    this.icon = icon;
    this.numberOfDecimals = numberOfDecimals;
    this.publicExistentialDeposit = publicExistentialDeposit;
    this.existentialDeposit = isPrivate ? new BN(0) : publicExistentialDeposit;
    this.isPrivate = isPrivate;
    this.isNativeToken = isNativeToken;
  }

  static Dolphin(isPrivate) {
    return new AssetType(
      AssetIds.DOL,
      'Dolphin',
      'DOL',
      Svgs.Dolphin,
      18,
      new BN('100000000000000000'),
      isPrivate,
      true,
    );
  }

  static Calamari(isPrivate) {
    return new AssetType(
      AssetIds.KMA,
      'Calamari',
      'KMA',
      Svgs.Calamari,
      18,
      new BN('100000000000000000'),
      isPrivate,
      true,
    );
  }


  static Karura(isPrivate) {
    return new AssetType(
      AssetIds.KAR,
      'Karura',
      'KAR',
      Svgs.KarIcon,
      12,
      new BN('100000000000'),
      isPrivate,
      false,
    );
  }

  static AcalaDollar(isPrivate) {
    return new AssetType(
      AssetIds.AUSD,
      'Acala Dollar',
      'aUSD',
      Svgs.AusdIcon,
      12,
      new BN('10000000000'),
      isPrivate
    );
  }

  static Kusama(isPrivate) {
    return new AssetType(
      AssetIds.KSM,
      'Kusama',
      'KSM',
      Svgs.KusamaIcon,
      12,
      new BN('500000000'),
      isPrivate,
      false,
    );
  }

  static KaruraLiquidKusama(isPrivate) {
    return new AssetType(
      AssetIds.LKSM,
      'Karura Liquid Kusama',
      'LKSM',
      Svgs.KusamaIcon,
      12,
      new BN('500000000'),
      isPrivate,
      false,
    );
  }

  static Rococo(isPrivate) {
    return new AssetType(
      AssetIds.ROC,
      'Rococo',
      'ROC',
      Svgs.RocIcon,
      12,
      new BN('1'),
      isPrivate
    );
  }

  static KintsugiBTC(isPrivate) {
    return new AssetType(
      AssetIds.KBTC,
      'Kintsugi BTC',
      'kBTC',
      Svgs.KbtcIcon,
      8,
      new BN('1'),
      isPrivate
    );
  }

  static Moonriver(isPrivate) {
    return new AssetType(
      AssetIds.MOVR,
      'Moonriver',
      'MOVR',
      Svgs.MovrIcon,
      18,
      new BN('10000000000000000'),
      isPrivate
    );
  }

  static AllCurrencies(isPrivate) {
    if (config.NETWORK_NAME === "Dolphin") {
      return [
        AssetType.Karura(isPrivate),
        AssetType.AcalaDollar(isPrivate),
        AssetType.KaruraLiquidKusama(isPrivate),
        AssetType.Rococo(isPrivate),
        AssetType.KintsugiBTC(isPrivate),
        AssetType.Moonriver(isPrivate),
        AssetType.Dolphin(isPrivate)
      ];
    } else if (config.NETWORK_NAME === "Calamari") {
      return [
        AssetType.Karura(isPrivate),
        AssetType.AcalaDollar(isPrivate),
        AssetType.KaruraLiquidKusama(isPrivate),
        AssetType.Moonriver(isPrivate),
        AssetType.Kusama(isPrivate),
        AssetType.Calamari(isPrivate)
      ];
    }
  }

  static _getFullName(baseName, isPrivate) {
    return isPrivate ? `Test Private ${baseName}` : `Test ${baseName}`;
  }

  static _getFullTicker(baseTicker, isPrivate) {
    return isPrivate ? `p${baseTicker}` : baseTicker;
  }

  toPrivate() {
    return new AssetType(
      this.assetId,
      this.baseName,
      this.baseTicker,
      this.icon,
      this.numberOfDecimals,
      this.publicExistentialDeposit,
      true,
      this.isNativeToken
    );
  }

  toPublic() {
    return new AssetType(
      this.assetId,
      this.baseName,
      this.baseTicker,
      this.icon,
      this.numberOfDecimals,
      this.publicExistentialDeposit,
      false,
      this.isNativeToken
    );
  }

  toggleIsPrivate() {
    if (this.isPrivate) {
      return this.toPublic();
    } else {
      return this.toPrivate();
    }
  }

  canTransferXcm = (originChain, destinationChain) => {
    const res = (
      originChain.xcmAssets.find(asset => asset.name === this.name)
      && destinationChain.xcmAssets.find(asset => asset.name === this.name)
    );
    return res;
  };
}
