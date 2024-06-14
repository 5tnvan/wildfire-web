/**
 * FUNCTION: convertUsdToEth()
 * RETURN: { roundedEthAmount }
 **/
export const convertUsdToEth = (value: any, nativeCurrencyPrice: any) => {
  // Convert USD to ETH using the nativeCurrencyPrice
  const calculatedEthAmount = value / nativeCurrencyPrice;

  // Round to 8 decimal places (adjust as needed)
  const roundedEthAmount = parseFloat(calculatedEthAmount.toFixed(8));

  return roundedEthAmount;
};
