"use client";

import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";

//https://api.studio.thegraph.com/query/68297/wildpay-eth-mainnet/0.0.1
//https://api.studio.thegraph.com/query/68297/wildpay-sepolia-v4/0.0.1
const apolloClientEthereum = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/68297/wildpay-eth-mainnet/0.0.1",
  cache: new InMemoryCache(),
});

//https://api.studio.thegraph.com/query/68297/wildpay-base-mainnet/0.0.1
//https://api.studio.thegraph.com/query/68297/wildpay-base-sepolia/0.0.1
const apolloClientBase = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/68297/wildpay-base-mainnet/0.0.1",
  cache: new InMemoryCache(),
});

/**
 * FETCH: fetchOutgoingTransactions()
 * DB: subpgraph
 * TABLE: "paymentsChanges"
 * RETURN: { outgoingTransactionsData }
 **/

export const useOutgoingTransactions = (senderAddress: any) => {
  const PAYMENTS_GRAPHQL = `
      query GetPayments($senderAddress: Bytes!) {
        paymentChanges(
          where: { sender: $senderAddress }
          orderBy: blockTimestamp
          orderDirection: desc
        ) {
          id
          sender
          receiver
          newMessage
          value
          fee
          blockNumber
          blockTimestamp
          transactionHash
        }
      }
    `;

  const { data: ethereumData } = useQuery(gql(PAYMENTS_GRAPHQL), {
    variables: { senderAddress },
    pollInterval: 10000,
    fetchPolicy: "network-only",
    client: apolloClientEthereum,
  });

  const { data: baseData } = useQuery(gql(PAYMENTS_GRAPHQL), {
    variables: { senderAddress },
    pollInterval: 10000,
    fetchPolicy: "network-only",
    client: apolloClientBase,
  });

  return { ethereumData, baseData };
};
