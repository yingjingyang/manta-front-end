// @ts-nocheck
import STAKE_ACTIONS from './stakeActions';

export const STAKE_INIT_STATE = {
  collatorCandidates: [],
  userDelegations: [],
  unstakeRequests: [],
  userTotalBalance: null,
  userAvailableBalance: null,
  userStakedBalance: null,
  stakeTargetBalance: null,
  unstakeTargetBalance: null,
  selectedCollator: null,
  selectedDelegation: null,
  selectedUnstakeRequest: null,
  usdPerKma: null,
};

export const stakeReducer = (state, action) => {
  switch (action.type) {
  case STAKE_ACTIONS.SET_COLLATOR_CANDIDATES:
    return setCollatorCandidates(state, action);

  case STAKE_ACTIONS.SET_USER_BALANCE:
    return setUserBalance(state, action);

  case STAKE_ACTIONS.SET_USER_DELEGATIONS:
    return setUserDelegations(state, action);

  case STAKE_ACTIONS.SET_UNSTAKE_REQUESTS:
    return setUnstakeRequests(state, action);

  case STAKE_ACTIONS.SET_STAKE_TARGET_BALANCE:
    return setStakeTargetBalance(state, action);

  case STAKE_ACTIONS.SET_UNSTAKE_TARGET_BALANCE:
    return setUnstakeTargetBalance(state, action);

  case STAKE_ACTIONS.SET_SELECTED_COLLATOR:
    return setSelectedCollator(state, action);

  case STAKE_ACTIONS.SET_SELECTED_UNSTAKE_REQUEST:
    return setSelectedUnstakeRequest(state, action);

  case STAKE_ACTIONS.SET_USD_PER_KMA:
    return setUsdPerKma(state, action);

  case STAKE_ACTIONS.SET_USER_TOTAL_RECENT_REWARDS:
    return setUserTotalRecentRewards(state, action);

  default:
    throw new Error(`Unknown type: ${action.type}`);
  }
};

const getSelectedCollatorDelegation = (selectedCollator, userDelegations) => {
  if (!selectedCollator) {
    return null;
  }
  return userDelegations.find(
    delegation => delegation.collator.address === selectedCollator.address
  );
};

const setCollatorCandidates = (state, { collatorCandidates }) => {
  return {
    ...state,
    collatorCandidates
  };
};

const setUserBalance = (state, { userTotalBalance, userAvailableBalance }) => {
  return {
    ...state,
    userTotalBalance,
    userAvailableBalance
  };
};

const setUserDelegations = (state, { userDelegations, userStakedBalance }) => {
  return {
    ...state,
    userDelegations,
    userStakedBalance
  };
};

const setUnstakeRequests = (state, { unstakeRequests }) => {
  return {
    ...state,
    unstakeRequests
  };
};

const setStakeTargetBalance = (state, { stakeTargetBalance }) => {
  return {
    ...state,
    stakeTargetBalance
  };
};

const setUnstakeTargetBalance = (state, { unstakeTargetBalance }) => {
  return {
    ...state,
    unstakeTargetBalance
  };
};

const setSelectedCollator = (state, {selectedCollator}) => {
  const selectedCollatorDelegation = getSelectedCollatorDelegation(
    selectedCollator, state.userDelegations
  );
  const stakeTargetBalance = selectedCollator ? state.stakeTargetBalance : null;
  const unstakeTargetBalance = selectedCollator ? state.unstakeTargetBalance : null;

  return {
    ...state,
    selectedCollator,
    selectedCollatorDelegation,
    stakeTargetBalance,
    unstakeTargetBalance
  };
};

const setSelectedUnstakeRequest = (state, {selectedUnstakeRequest}) => {
  return {
    ...state,
    selectedUnstakeRequest
  };
};

const setUsdPerKma = (state, {usdPerKma}) => {
  return {
    ...state,
    usdPerKma
  };
};

const setUserTotalRecentRewards = (state, {userTotalRecentRewards, secondsSinceReward}) => {
  return {
    ...state,
    userTotalRecentRewards,
    secondsSinceReward
  };
};
