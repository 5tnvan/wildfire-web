"use client";

import { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { fetchFollowed } from "~~/utils/wildfire/fetch/fetchFollows";
import { fetchProfilesWithRange, fetchUser } from "~~/utils/wildfire/fetch/fetchUser";

// Define Apollo Client instances for each endpoint
const apolloClientEthereum = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/68297/wildpay-eth-mainnet/0.0.1",
  cache: new InMemoryCache(),
});

const SUBGRAPH_API_KEY = process.env.NEXT_PUBLIC_SUBGRAPH_API_KEY;

const apolloClientBase = new ApolloClient({
  uri: `https://gateway.thegraph.com/api/${SUBGRAPH_API_KEY}/subgraphs/id/ANu9ycvF7GU3K9Gt7ZkSRbXEt9wVr8vVEvH92p7MjX3P`,
  cache: new InMemoryCache(),
});

const PAYMENTS_GRAPHQL = gql`
  query GetPaymentChanges($receiverAddress: Bytes!) {
    paymentChanges(where: { receiver: $receiverAddress }, orderBy: blockTimestamp, orderDirection: desc) {
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

const getRange = (page: number, range: number) => {
  const from = page * range;
  const to = from + range - 1;
  return { from, to };
};

// Helper function to fetch transaction data
const fetchTransactionData = async (address: string, client: ApolloClient<any>) => {
  if (!address) return null; // Skip query if address is not defined

  try {
    const { data } = await client.query({
      query: PAYMENTS_GRAPHQL,
      variables: { receiverAddress: address },
      fetchPolicy: "network-only",
    });
    return data;
  } catch (error) {
    console.error(`Error fetching data for address ${address}:`, error);
    return null;
  }
};

export const useCreators = () => {
  const range = 20;

  const [loading, setLoading] = useState(false);
  const [feed, setFeed] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setPage(0); // Reset page
    setFeed([]); // Reset feed
    setHasMore(true); // Reset hasMore to true
    setTriggerRefetch(prev => !prev); // Trigger refetch
  };

  const fetchMore = () => {
    console.log("fetching more");
    if (hasMore) {
      setPage(prevPage => prevPage + 1); // Increase page by 1
    }
  };

  const fetchCreators = async () => {
    setLoading(true);
    const { from, to } = getRange(page, range);
    const user = await fetchUser();

    if (user.user) {
      const profiles = await fetchProfilesWithRange(from, to);

      if (profiles) {
        const masterData = await Promise.all(
          profiles.map(async (profile: any) => {
            const isFollowed = await fetchFollowed(user.user.id, profile.id);

            // Fetch transaction data for the profile
            const ethereumDataPromise = fetchTransactionData(profile.wallet_id, apolloClientEthereum);
            const baseDataPromise = fetchTransactionData(profile.wallet_id, apolloClientBase);

            const [ethereumData, baseData] = await Promise.all([ethereumDataPromise, baseDataPromise]);

            return {
              ...profile,
              isFollowed,
              ethereumData,
              baseData,
            };
          }),
        );

        if (profiles.length < range) setHasMore(false); // No more data to fetch

        // Update feed with combined data
        setFeed(existingFeed => [...existingFeed, ...masterData]);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, [page, triggerRefetch]);

  return { loading, feed, fetchMore, refetch };
};
