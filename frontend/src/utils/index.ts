export const formatBalance = (rawBalance: string) => {
  const balance = (
    parseInt(rawBalance.toString()) / 1000000000000000000
  ).toFixed(2);
  return balance;
};

export const formatPrice = (value: number | undefined): string => {
  return value == undefined
    ? ''
    : value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
