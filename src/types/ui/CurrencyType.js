import Svgs from 'resources/icons';

export default class CurrencyType {
  constructor(assetId, name, ticker, icon) {
    this.assetId = assetId;
    this.name = name;
    this.ticker = ticker;
    this.icon = icon;
  }

  static Polkadot() {
    return new CurrencyType(1, 'Polkadot', 'DOT', Svgs.TokenIcon);
  }
  static Kusama() {
    return new CurrencyType(2, 'Kusama', 'KSM', Svgs.CoinIcon);
  }
  static AllCurrencies() {
    return [CurrencyType.Polkadot(), CurrencyType.Kusama()];
  }
}
