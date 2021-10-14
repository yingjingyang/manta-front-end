import BN from 'bn.js';
import CoinSelection from 'types/CoinSelection';

/**
 * 1. Add eligible assets to our coin selection until we reach target amount
 * 2. If we have selected an odd number of coins and have remaining unselected assets,
 * add one more asset to the coin selection.
 * 3. If we have an odd number of coins but no remaining unselected assets,
 * add an asset with zero value to the coin selection
 */
const selectCoins = (targetAmount, spendableAssets) => {
  let totalAmount = new BN(0);
  let selectedCoins = [];
  spendableAssets.forEach((asset) => {
    if (totalAmount.lt(targetAmount) || selectedCoins.length % 2) {
      totalAmount = totalAmount.add(asset.value);
      selectedCoins.push(asset);
    }
  });
  return new CoinSelection(selectedCoins, totalAmount, targetAmount);
};

export default selectCoins;
