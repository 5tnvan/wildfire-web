"use client";

import { useEffect, useState } from "react";
import { fetchFollowed } from "~~/utils/wildfire/fetch/fetchFollows";
import { fetchProfilesWithRange, fetchUser } from "~~/utils/wildfire/fetch/fetchUser";

const getRange = (page: number, range: number) => {
  const from = page * range;
  const to = from + range - 1;
  return { from, to };
};

export const useCreators = (range: number) => {

  const [loading, setLoading] = useState(false);
  const [feed, setFeed] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setPage(0);
    setFeed([]);
    //setHasMore(true);
    setTriggerRefetch(prev => !prev);
  };

  const fetchMore = () => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const fetchCreators = async () => {
    setLoading(true);
    const { from, to } = getRange(page, range);
    const res = await fetchUser();

    if (res.user) {
      const profiles = await fetchProfilesWithRange(from, to);

      if (profiles) {
        const masterData = await Promise.all(
          profiles.map(async (profile: any) => {
            const isFollowed = await fetchFollowed(res.user.id, profile.id);

            return {
              ...profile,
              isFollowed,
            };
          }),
        );
        // Append new data to the existing feed
        setFeed(prevFeed => [...prevFeed, ...masterData]);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, [page, triggerRefetch]);

  return { loading, feed, fetchMore, refetch };
};
