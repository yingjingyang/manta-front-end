
// @ts-nocheck
import Decimal from 'decimal.js';
import * as axios from 'axios';
import Balance from 'types/Balance';
import BN from 'bn.js';
import Delegation from 'types/Delegation';

// Get the proportion of delegated rewards paid to colators
export const getCollatorComission = async (api) => {
  const collatorComissionRaw = await api.query.parachainStaking.collatorCommission();
  return new Decimal(collatorComissionRaw.toHuman().slice(0, -1)).div(new Decimal(100));
};

// Gets total KMA issuance across all accounts
const _getTotalKMAIssuance = async (api, config) => {
  const totalIssuanceRaw = await api.query.balances.totalIssuance();
  return Balance.Native(config, new BN(totalIssuanceRaw.toString()));
};

// Gets approximate amount of the new native token generated yearly
export const getAnnualInflation = async (api, config) => {
  const totalKMAIssuance = await _getTotalKMAIssuance(api, config);
  const inflationConfig = await api.query.parachainStaking.inflationConfig();
  const annualInflationPercent = new Decimal(inflationConfig.annual.ideal.toHuman().slice(0, -1));
  const annualInflationRatio = annualInflationPercent.div(100);
  const totalKMAIssuanceAtomicUnits = new Decimal(totalKMAIssuance.valueAtomicUnits.toString());
  const annualInflationAtomicUnits = totalKMAIssuanceAtomicUnits.mul(annualInflationRatio);
  return Balance.Native(config, new BN(annualInflationAtomicUnits.round().toFixed()));
};

// Gets active status for a list of collator addresses
export const getCollatorsAreActive = async (api, collatorAddresses) => {
  const activeCollators = await api.query.parachainStaking.selectedCandidates();
  return collatorAddresses.map(address => activeCollators.includes(address));
};

// Gets various collator info provided by the candidateInfo query
export const getCollatorCandidateInfo = async (api, config, collatorAddresses) => {
  const statsListRaw = await api.query.parachainStaking.candidateInfo.multi(collatorAddresses);
  return statsListRaw
    .filter(candidateInfo => !candidateInfo.isNone)
    .map(candidateInfo => {
      return {
        balanceSelfBonded: Balance.Native(config, new BN(candidateInfo.value.bond.toString())),
        balanceEffectiveBonded: Balance.Native(config,
          new BN(candidateInfo.value.totalCounted.toString())
        ),
        delegationCount: candidateInfo.value.delegationCount.toNumber(),
        lowestTopDelegationAmount: Balance.Native(
          config, new BN(candidateInfo.value.lowestTopDelegationAmount.toString())
        )
      };
    });
};

// Gets all delegations for the given address
export const getDelegations = async (api, config, userAddress) => {
  const delegatorState = await api.query.parachainStaking.delegatorState(userAddress);
  const delegationsRaw = delegatorState.isSome
    ? delegatorState.value.delegations
    : [];
  return delegationsRaw.map(delegationRaw => {
    const delegatedBalance = Balance.Native(config, new BN(delegationRaw.amount.toString()));
    return new Delegation(delegationRaw.owner.toString(), delegatedBalance);
  });
};

// Gets Calamari value denominated in USD
export const getCalamariTokenValue = async () => {
  const res = await axios.get(
    'https://api.coingecko.com/api/v3/simple/price?ids=calamari-network&vs_currencies=usd'
  );
  return new Decimal(res.data['calamari-network']['usd']);
};
