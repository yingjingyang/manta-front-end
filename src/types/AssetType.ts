// @ts-nocheck
import Svgs from 'resources/icons';
import BN from 'bn.js';

// const DolphinAssetIds = {
//   DOL: 1,
//   KAR: 8,
//   AUSD: 9,
//   LKSM: 10,
//   ROC: 11,
//   KBTC: 12,
//   MOVR: 13,
//   PHA: 14,
//   RASTR: 16
// }

const DolphinAssetIds = {
  DOL: 1,
  KSM: 8,
  MOVR: 9,
  KAR: 10
};

const CalamariAssetIds = {
  KMA: 1,
  KAR: 8,
  AUSD: 9,
  LKSM: 10,
  MOVR: 11,
  KSM: 12,
  PHA: 13
}

const getAssetIds = (config) => {
  if (config.NETWORK_NAME === 'Calamari') {
    return CalamariAssetIds;
  } else if (config.NETWORK_NAME === 'Dolphin') {
    return DolphinAssetIds;
  } else if (config.NETWORK_NAME === 'Manta') {
    throw new Error('Unimplemented');
  }
}

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

  static Native(config) {
    if (config.NETWORK_NAME === 'Calamari') {
      return AssetType.Calamari(config, false);
    } else {
      return AssetType.Dolphin(config, false);
    }
  }

  static Dolphin(config, isPrivate) {
    return new AssetType(
      getAssetIds(config).DOL,
      'Dolphin',
      'DOL',
      Svgs.Dolphin,
      18,
      new BN('100000000000000000'),
      isPrivate,
      true,
    );
  }

  static Calamari(config, isPrivate) {
    return new AssetType(
      getAssetIds(config).KMA,
      'Calamari',
      'KMA',
      Svgs.Calamari,
      12,
      new BN('100000000000'),
      isPrivate,
      true,
    );
  }


  static Karura(config, isPrivate) {
    return new AssetType(
      getAssetIds(config).KAR,
      'Karura',
      'KAR',
      Svgs.KarIcon,
      12,
      new BN('100000000000'),
      isPrivate,
      false,
    );
  }

  static AcalaDollar(config, isPrivate) {
    return new AssetType(
      getAssetIds(config).AUSD,
      'Acala Dollar',
      'aUSD',
      Svgs.AusdIcon,
      12,
      new BN('10000000000'),
      isPrivate
    );
  }

  static Kusama(config, isPrivate) {
    return new AssetType(
      getAssetIds(config).KSM,
      'Kusama',
      'KSM',
      Svgs.KusamaIcon,
      12,
      new BN('500000000'),
      isPrivate,
      false,
    );
  }

  static KaruraLiquidKusama(config, isPrivate) {
    return new AssetType(
      getAssetIds(config).LKSM,
      'Karura Liquid Kusama',
      'LKSM',
      Svgs.KusamaIcon,
      12,
      new BN('500000000'),
      isPrivate,
      false,
    );
  }

  static Rococo(config, isPrivate) {
    return new AssetType(
      getAssetIds(config).ROC,
      'Rococo',
      'ROC',
      Svgs.RocIcon,
      12,
      new BN('1'),
      isPrivate
    );
  }

  static KintsugiBTC(config, isPrivate) {
    return new AssetType(
      getAssetIds(config).KBTC,
      'Kintsugi BTC',
      'kBTC',
      Svgs.KbtcIcon,
      8,
      new BN('1'),
      isPrivate
    );
  }

  static Moonriver(config, isPrivate) {
    return new AssetType(
      getAssetIds(config).MOVR,
      'Moonriver',
      'MOVR',
      Svgs.MovrIcon,
      18,
      new BN('10000000000000000'),
      isPrivate
    );
  }

  static AllCurrencies(config, isPrivate) {
    if (config.NETWORK_NAME === "Dolphin") {
      return [
        AssetType.Karura(config, isPrivate),
        AssetType.Kusama(config, isPrivate),
        AssetType.Moonriver(config, isPrivate),
        AssetType.Dolphin(config, isPrivate)
      ];
    } else if (config.NETWORK_NAME === "Calamari") {
      return [
        AssetType.Karura(config, isPrivate),
        AssetType.AcalaDollar(config, isPrivate),
        AssetType.KaruraLiquidKusama(config, isPrivate),
        AssetType.Moonriver(config, isPrivate),
        AssetType.Kusama(config, isPrivate),
        AssetType.Calamari(config, isPrivate)
      ];
    }
  }

  static _getFullName(baseName, isPrivate) {
    return isPrivate ? `Test zk${baseName}` : `Test ${baseName}`;
  }

  static _getFullTicker(baseTicker, isPrivate) {
    return isPrivate ? `zk${baseTicker}` : baseTicker;
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
    return originChain.xcmAssets.find(asset => asset.name === this.name)
      && destinationChain.xcmAssets.find(asset => asset.name === this.name)
  };
}
