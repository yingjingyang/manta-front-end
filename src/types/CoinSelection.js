export default class CoinSelection {
  constructor(coins, totalAmount, targetAmount) {
    this.coins = coins;
    this.totalAmount = totalAmount;
    this.targetAmount = targetAmount;
    this.changeAmount = totalAmount.sub(targetAmount);
    this.assetId = this.coins[0].assetId;
  }

  requiresZeroCoin() {
    return this.coins.length === 1;
  }

  last() {
    return this.coins[this.coins.length - 1];
  }
}
