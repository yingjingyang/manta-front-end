const getBalanceString = (balance) => {
  if (!balance) return 'Available: ...';
  return `Available: ${balance.toString(true)}`;
};

export default getBalanceString;
