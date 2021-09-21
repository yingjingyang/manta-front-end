import BN from 'bn.js';
import { loadSpendableAssetsById } from 'utils/persistence/AssetStorage';

/**
 * 1. Load all assets of the correct asset_id
 * 2. Add assets to our coin selection until we reach target amount
 * 3. If we have selected an odd number of coins and have remaining unselected assets,
 * add one more asset to the coin selection.
 * 4. If we have an odd number of coins but no remaining unselected assets,
 * add an asset with zero value to the coin selection
 */
const selectCoins = (amount, assetId) => {
  let totalAmount = new BN(0);
  let coinSelection = [];
  const spendableAssets = loadSpendableAssetsById(assetId);
  spendableAssets.forEach((asset) => {
    if (totalAmount.lt(amount) || coinSelection.length % 2) {
      totalAmount = totalAmount.add(asset.value);
      coinSelection.push(asset);
    }
  });
  const changeAmount = totalAmount.sub(totalAmount);
  return [coinSelection, changeAmount];
};

export default selectCoins;
