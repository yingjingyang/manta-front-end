// @ts-nocheck
import Decimal from 'decimal.js';
import BN from 'bn.js';

export default class Balance {
  constructor(assetType, valueAtomicUnits) {
    this.assetType = assetType;
    this.valueAtomicUnits = valueAtomicUnits;
  }

  valueOverExistentialDeposit() {
    const existentialDeposit = new Balance(
      this.assetType,
      this.assetType.existentialDeposit
    );
    const value = this.sub(existentialDeposit);
    const zero = new Balance(this.assetType, new BN(0));
    return Balance.max(value, zero);
  }

  static fromBaseUnits(assetType, valueBaseUnits) {
    const atomicUnitsPerBaseUnit = new Decimal(10).pow(
      new Decimal(assetType.numberOfDecimals)
    );
    const valueAtomicUnits = atomicUnitsPerBaseUnit.mul(new Decimal(valueBaseUnits.toString()));
    // This conversion to BN doesn't work if our valueAtomicUnits Decimal
    // is formatted as an exponent
    Decimal.set({ toExpPos: 1000 });
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
    console.log('valueBaseUnits', valueBaseUnits.toString());
    return valueBaseUnits;
  }

  toString(shouldFormat) {
    return !shouldFormat
      ? this.valueBaseUnits().toDecimalPlaces(3, Decimal.ROUND_DOWN).toString()
      : `${this.valueBaseUnits()
        .toDecimalPlaces(3, Decimal.ROUND_DOWN)
        .toNumber()
        .toLocaleString(undefined, {
          maximumFractionDigits: 3,
          minimumFractionDigits: 0,
        })} ${this.assetType.ticker}`;
  }

  toFeeString() {
    return `${this.valueBaseUnits()
      .toDecimalPlaces(6, Decimal.ROUND_UP)
      .toNumber()
      .toLocaleString(undefined, {
        maximumFractionDigits: 6,
        minimumFractionDigits: 0,
      })} ${this.assetType.ticker}`;
  }

  gt(other) {
    if (this.assetType.assetId !== other.assetType.assetId) {
      throw new Error('Cannot compare different asset types');
    }
    return this.valueAtomicUnits.gt(other.valueAtomicUnits);
  }

  gte(other) {
    if (this.assetType.assetId !== other.assetType.assetId) {
      throw new Error('Cannot compare different asset types');
    }
    return this.valueAtomicUnits.gte(other.valueAtomicUnits);
  }

  lt(other) {
    if (this.assetType.assetId !== other.assetType.assetId) {
      throw new Error('Cannot compare different asset types');
    }
    return this.valueAtomicUnits.lt(other.valueAtomicUnits);
  }

  sub(other) {
    if (this.assetType.assetId !== other.assetType.assetId) {
      throw new Error('Cannot subtract different asset types');
    }
    const value = this.valueAtomicUnits.sub(other.valueAtomicUnits);
    return new Balance(this.assetType, value);
  }

  add(other) {
    if (this.assetType.assetId !== other.assetType.assetId) {
      throw new Error('Cannot add different asset types');
    }
    const value = this.valueAtomicUnits.add(other.valueAtomicUnits);
    return new Balance(this.assetType, value);
  }

  static max(a, b) {
    if (a.assetType.assetId !== b.assetType.assetId) {
      throw new Error('Cannot compare different asset types');
    }
    const value = BN.max(a.valueAtomicUnits, b.valueAtomicUnits);
    return new Balance(a.assetType, value);
  }
}
