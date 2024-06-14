/**
 * FUNCTION: convertEthToUsd()
 * RETURN: { roundedUsdAmount }
 **/

export const convertEthToUsd = (value: any, nativeCurrencyPrice: any) => {
  // Convert ETH to USD using the nativeCurrencyPrice
  const calculatedUsdAmount = value * nativeCurrencyPrice;

  // Round to 2 decimal places (or adjust as needed)
  const roundedUsdAmount = parseFloat(calculatedUsdAmount.toFixed(2));

  return roundedUsdAmount;
};
