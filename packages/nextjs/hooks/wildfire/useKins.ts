"use client";

import { useEffect, useState } from "react";
import { fetchProfilesWithRange } from "~~/utils/wildfire/fetch/fetchUser";

const getRange = (page: number, range: number) => {
  const from = page * range;
  const to = from + range - 1;
  return { from, to };
};

export const useKins = (range: number) => {

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
    const { from, to } = getRange(page, range);
    setLoading(true);
    const profiles = await fetchProfilesWithRange(from, range);
    if (profiles) {
      setFeed(profiles);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCreators();
  }, [page, triggerRefetch]);

  return { loading, feed, fetchMore, refetch };
};
