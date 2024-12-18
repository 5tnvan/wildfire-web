"use client";

import { useEffect, useState } from "react";
import { fetchTags } from "~~/utils/wildfire/fetch/fetchTags";

/**
 * useFeed HOOK
 * Use this to a video, plus feed
 **/
export const useTags = (limit: any) => {
  const [loading, setLoading] = useState(false);
  const [feed, setFeed] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch(prev => !prev); // Trigger refetch
  };

  const fetchFeed = async () => {
    setLoading(true);

    // Get auth user and feed
    const data = await fetchTags(limit);
    if (data) {
      setFeed(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, [triggerRefetch]);

  return { loading, feed, refetch };
};
