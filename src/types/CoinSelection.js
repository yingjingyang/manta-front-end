export default class CoinSelection {
  constructor(coins, totalAmount, targetAmount) {
    this.coins = coins;
    this.totalAmount = totalAmount;
    this.targetAmount = targetAmount;
    this.changeAmount = totalAmount.sub(targetAmount);
  }
}
