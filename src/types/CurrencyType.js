import Images from 'common/Images';

export default class CurrencyType {
  constructor(assetId, name, ticker, icon) {
    this.assetId = assetId;
    this.name = name;
    this.ticker = ticker;
    this.icon = icon;
  }

  static Polkadot() {
    return new CurrencyType(1, 'Polkadot', 'DOT', Images.TokenIcon);
  }
  static Kusama() {
    return new CurrencyType(1, 'Kusama', 'KSM', Images.CoinIcon);
  }
  static AllCurrencies() {
    return [CurrencyType.Polkadot(), CurrencyType.Kusama()];
  }
}
