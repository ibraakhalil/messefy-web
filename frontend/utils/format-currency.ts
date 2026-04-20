export const CURRENCY_SYMBOL = '৳';
export const CURRENCY_CODE = 'BDT';
export const CURRENCY_NAME = 'Bangladeshi Taka';

export function formatCurrency(
  amount: number,
  options?: Intl.NumberFormatOptions,
) {
  const formattedAmount = new Intl.NumberFormat('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);

  return `${CURRENCY_SYMBOL}${formattedAmount}`;
}
