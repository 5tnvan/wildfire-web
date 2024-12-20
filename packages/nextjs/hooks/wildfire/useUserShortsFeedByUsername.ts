"use client";

import { useEffect, useState } from "react";
import { fetchUserShortsFeedAll, fetchUserShortsFeedWithRange } from "../../utils/wildfire/fetch/fetchShortsFeeds";
import { fetchProfileByUsername } from "~~/utils/wildfire/fetch/fetchProfile";

const getRange = (page: number, range: number) => {
  const from = page * range;
  const to = from + range - 1;
  return { from, to };
};

/**
 * useFeed HOOK
 * Use this to get feed of videos
 **/
export const useUserShortsFeedByUsername = (username: any, range: number) => {
  const [loading, setLoading] = useState(false);
  const [feed, setFeed] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
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

  const fetchFeed = async () => {
    setLoading(true);
    const { from, to } = getRange(page, range);
    const profile = await fetchProfileByUsername(username);
    if (profile) {
      const count = await fetchUserShortsFeedAll(profile.id);
      const data = await fetchUserShortsFeedWithRange(profile.id, from, to);

      if (count) {
        setCount(count.length);
      }

      if (data) {
        if (data.length < range) setHasMore(false); // No more data to fetch
        setFeed(existingFeed => [...existingFeed, ...data]);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [page, triggerRefetch]);

  return { loading, feed, count, fetchMore, refetch };
};
