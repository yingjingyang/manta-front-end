import Decimal from 'decimal.js';

export default class Usd {
  value: Decimal;

  constructor(value: Decimal) {
    this.value = value;
  }

  add(val: Decimal) {
    this.value = this.value.add(val);
  }

  minus(val: Decimal) {
    this.value = this.value.minus(val);
  }

  mul(val: Decimal) {
    this.value = this.value.mul(val);
  }

  div(val: Decimal) {
    this.value = this.value.div(val);
  }

  toUsdString() {
    return `$${this.value
      .toDecimalPlaces(2, Decimal.ROUND_DOWN)
      .toNumber()
      .toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      })}`;
  }
}
