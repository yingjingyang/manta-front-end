import Svgs from 'resources/icons';

export default class AssetType {
  constructor(
    assetId,
    name,
    ticker,
    icon,
    numberOfDecimals,
    isPrivate = false,
    isNativeToken = false
  ) {
    this.assetId = assetId;
    this.name = name;
    this.ticker = ticker;
    this.icon = icon;
    this.numberOfDecimals = numberOfDecimals;
    this.isPrivate = isPrivate;
    this.isNativeToken = isNativeToken;
  }

  static Dolphin() {
    return new AssetType(-1, 'Dolphin', 'DOL', Svgs.Logo, 12, false, true);
  }

  static Polkadot(isPrivate) {
    const name = isPrivate ? 'Fake Private Polkadot' : 'Fake Polkadot';
    const ticker = isPrivate ? 'pDOT' : 'DOT';
    return new AssetType(0, name, ticker, Svgs.TokenIcon, 10, isPrivate);
  }

  static Kusama(isPrivate) {
    const name = isPrivate ? 'Fake Private Kusama' : 'Fake Kusama';
    const ticker = isPrivate ? 'pKSM' : 'KSM';
    return new AssetType(1, name, ticker, Svgs.KusamaIcon, 12, isPrivate);
  }

  static Bitcoin(isPrivate) {
    const name = isPrivate ? 'Fake Private Bitcoin' : 'Fake Bitcoin';
    const ticker = isPrivate ? 'pBTC' : 'BTC';
    return new AssetType(2, name, ticker, Svgs.BitcoinIcon, 8, isPrivate);
  }

  static Etherium(isPrivate) {
    const name = isPrivate ? 'Fake Private Etherium' : 'Fake Etherium';
    const ticker = isPrivate ? 'pETH' : 'ETH';
    return new AssetType(3, name, ticker, Svgs.EtheriumIcon, 18, isPrivate);
  }

  static Acala(isPrivate) {
    const name = isPrivate ? 'Fake Private Acala' : 'Fake Acala';
    const ticker = isPrivate ? 'pACA' : 'ACA';
    return new AssetType(4, name, ticker, Svgs.AcalaIcon, 18, isPrivate);
  }

  static AllCurrencies(isPrivate) {
    const currencies = [
      AssetType.Polkadot(isPrivate),
      AssetType.Kusama(isPrivate),
      AssetType.Bitcoin(isPrivate),
      AssetType.Etherium(isPrivate),
      AssetType.Acala(isPrivate)
    ];
    if (!isPrivate) {
      currencies.push(AssetType.Dolphin());
    }
    return currencies;
  }

  static AllPublicCurrencies(isPrivate) {
    return [AssetType.Polkadot(isPrivate), AssetType.Kusama(isPrivate)];
  }
}
