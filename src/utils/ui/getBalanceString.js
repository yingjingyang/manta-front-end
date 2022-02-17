const getBalanceString = (balance) => {
  if (!balance) return 'Balance: ...';
  return `Balance: ${balance.toString(true)}`;
};

export default getBalanceString;
