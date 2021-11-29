import Decimal from 'decimal.js';
import BN from 'bn.js';

export default class Balance {
  constructor(assetType, valueAtomicUnits) {
    this.assetType = assetType;
    this.valueAtomicUnits = valueAtomicUnits;
  }

  static fromBaseUnits(assetType, valueBaseUnits) {
    const atomicUnitsPerBaseUnit = new Decimal(10).pow(
      new Decimal(assetType.numberOfDecimals)
    );
    const valueAtomicUnits = atomicUnitsPerBaseUnit.mul(valueBaseUnits);
    return new Balance(assetType, new BN(valueAtomicUnits.toString()));
  }

  valueBaseUnits() {
    const balanceAtomicUnitsDecimal = new Decimal(
      this.valueAtomicUnits.toString()
    );
    const atomicUnitsPerBaseUnit = new Decimal(10).pow(
      new Decimal(this.assetType.numberOfDecimals)
    );
    const valueBaseUnits = balanceAtomicUnitsDecimal.div(
      new Decimal(atomicUnitsPerBaseUnit)
    );
    return valueBaseUnits;
  }

  toString(shouldFormat) {
    return !shouldFormat
      ? this.valueBaseUnits().toString()
      : `${this.valueBaseUnits().toNumber().toLocaleString(undefined, {
        maximumFractionDigits: 1,
        minimumFractionDigits: 0,
      })} ${this.assetType.ticker}`;
  }

  gt(other) {
    return this.valueAtomicUnits.gt(other.valueAtomicUnits);
  }

  lt(other) {
    return this.valueAtomicUnits.lt(other.valueAtomicUnits);
  }
}
