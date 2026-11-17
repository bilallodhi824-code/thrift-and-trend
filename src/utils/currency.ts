/**
 * Currency formatting utility for Pakistani Rupees (PKR / Rs.)
 */
export const formatPrice = (amount: number): string => {
  if (typeof amount !== 'number' || isNaN(amount)) return 'Rs. 0';
  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
};

export const formatNumber = (amount: number): string => {
  if (typeof amount !== 'number' || isNaN(amount)) return '0';
  return Math.round(amount).toLocaleString('en-PK');
};
