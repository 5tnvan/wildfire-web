import { formatEther } from "viem";

export const calculateSum = (transactions: any) => {
  // Use BigInt for large values
  const totalSum =
    transactions?.paymentChanges?.reduce((sum: bigint, paymentChange: { value: any }) => {
      // Convert each paymentChange value to BigInt before adding
      return sum + BigInt(paymentChange.value);
    }, BigInt(0)) || BigInt(0);

  console.log("totalSum (wei)", totalSum.toString());

  // Convert the BigInt total sum from wei to Ether
  const totalSumEth = Number(formatEther(totalSum.toString())); // Convert to string for formatEther
  console.log("totalSumEth", totalSumEth);

  return totalSumEth;
};