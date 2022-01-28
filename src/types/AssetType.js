import Svgs from 'resources/icons';
export default class AssetType {
  constructor(
    assetId,
    baseName,
    baseTicker,
    icon,
    numberOfDecimals,
    isPrivate = false,
    isNativeToken = false
  ) {
    this.assetId = assetId;
    this.baseName = baseName;
    this.baseTicker = baseTicker;
    this.name = AssetType._getFullName(baseName, isPrivate);
    this.ticker = AssetType._getFullTicker(baseTicker, isPrivate);
    this.icon = icon;
    this.numberOfDecimals = numberOfDecimals;
    this.isPrivate = isPrivate;
    this.isNativeToken = isNativeToken;
  }

  static Dolphin() {
    return new AssetType(-1, 'Dolphin', 'DOLPH', Svgs.Logo, 12, false, true);
  }

  static Polkadot(isPrivate) {
    return new AssetType(0, 'Polkadot', 'DOT', Svgs.TokenIcon, 10, isPrivate);
  }

  static Kusama(isPrivate) {
    return new AssetType(1, 'Kusama', 'KSM', Svgs.KusamaIcon, 12, isPrivate);
  }

  static Bitcoin(isPrivate) {
    return new AssetType(2, 'Bitcoin', 'BTC', Svgs.BitcoinIcon, 8, isPrivate);
  }

  static Ethereum(isPrivate) {
    return new AssetType(
      3,
      'Ethereum',
      'ETH',
      Svgs.EtheriumIcon,
      18,
      isPrivate
    );
  }

  static Acala(isPrivate) {
    return new AssetType(4, 'Acala', 'ACA', Svgs.AcalaIcon, 18, isPrivate);
  }

  static AllCurrencies(isPrivate) {
    const currencies = [
      AssetType.Polkadot(isPrivate),
      AssetType.Kusama(isPrivate),
      AssetType.Bitcoin(isPrivate),
      AssetType.Ethereum(isPrivate),
      AssetType.Acala(isPrivate)
    ];
    if (!isPrivate) {
      currencies.push(AssetType.Dolphin());
    }
    return currencies;
  }

  static _getFullName(baseName, isPrivate) {
    return isPrivate ? `Test Private ${baseName}` : `Test ${baseName}`;
  }

  static _getFullTicker(baseTicker, isPrivate) {
    return isPrivate ? `p${baseTicker}` : baseTicker;
  }

  toPrivate() {
    if (this.isNativeToken) {
      throw new Error('Native token cannot be privatized');
    }
    return new AssetType(
      this.assetId,
      this.baseName,
      this.baseTicker,
      this.icon,
      this.numberOfDecimals,
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
      false,
      this.isNativeToken
    );
  }
}
