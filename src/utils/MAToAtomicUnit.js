import BN from 'bn.js';
import { useSubstrate } from '../substrate-lib';

// Convert Manta currency denominated in MA to the most granular units of Manta currency
export default function MAToAtomicUnits (amountMA) {
  const { api } = useSubstrate();
  const decimals = api.registry.chainDecimals;
  return amountMA * new BN(10).pow(new BN(decimals));
}
