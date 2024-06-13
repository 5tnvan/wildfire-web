"use client";

import { useEffect, useState } from "react";
import { fetchUserFeedAll } from "../../utils/wildfire/fetch/fetchFeeds";
import { fetchUser } from "../../utils/wildfire/fetch/fetchUser";

/**
 * useFeed HOOK
 * Use this to get feed of videos
 **/
export const useUserFeedAll = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [feed, setFeed] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch(prev => !prev); // Trigger refetch
  };

  const fetchFeed = async () => {
    setIsLoading(true);
    const user = await fetchUser();
    const data = await fetchUserFeedAll(user.user?.id);
    if (data) {
      setFeed(data);
      console.log("data", data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, [triggerRefetch]);

  return { isLoading, feed, refetch };
};
