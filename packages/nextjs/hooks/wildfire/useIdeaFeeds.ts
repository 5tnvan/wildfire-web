"use client";

import { useEffect, useState } from "react";
import { fetchLastestIdeaFeed, fetchMostViewedIdeaFeed, fetchRandomIdeaFeed } from "~~/utils/wildfire/fetch/fetchIdeaFeeds";

const getRange = (page: number, range: number) => {
  const from = page * range;
  const to = from + range - 1;
  return { from, to };
};

/**
 * useFeed HOOK
 * Use this to get feed of videos
 **/
export const useIdeasFeed = (filter: any, limit: number, range: number) => {
  const [loading, setLoading] = useState(false);
  const [feed, setFeed] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  //const [hasMore, setHasMore] = useState(true);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setPage(0); // Reset page
    setFeed([]); // Reset feed
    //setHasMore(true); // Reset hasMore to true
    setTriggerRefetch(prev => !prev); // Trigger refetch
  };

  const fetchMore = () => {
    setPage(prevPage => prevPage + 1); // Increase page by 1 to triggter fetchFeed
  };

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const { from, to } = getRange(page, range);

      let data;

      // Use switch for better readability
      switch (filter) {
        case "latest":
          data = await fetchLastestIdeaFeed(from, to);
          break;
        case "mostViewed":
          data = await fetchMostViewedIdeaFeed(from, to);
          break;
        case "random":
          data = await fetchRandomIdeaFeed(limit);
      }

      if (data) {
        // Append new data to the existing feed
        setFeed(prevFeed => [...prevFeed, ...data]);
      }
    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [page, triggerRefetch]);

  return { loading, feed, fetchMore, refetch };
};
