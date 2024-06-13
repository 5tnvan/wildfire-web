import { formatEther } from "viem";

/**
 * FUNCTION: calculateSum()
 * RETURN: { totalSumEth }
 **/
export const calculateSum = (transactions: any) => {
  const totalSum =
    transactions?.paymentChanges?.reduce((sum: number, paymentChange: { value: any }) => {
      return sum + Number(paymentChange.value);
    }, 0) || 0;

  const totalSumEth = Number(formatEther(totalSum));
  return totalSumEth;
};