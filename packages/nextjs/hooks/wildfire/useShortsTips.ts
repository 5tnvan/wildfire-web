"use client";

import { useEffect, useState } from "react";
import { fetchFollowed, fetchFollowers, fetchFollowing } from "~~/utils/wildfire/fetch/fetchFollows";
import { fetchIdea } from "~~/utils/wildfire/fetch/fetchIdea";
import { fetchLikes } from "~~/utils/wildfire/fetch/fetchIdeaLikes";
import { fetchProfileByUsername } from "~~/utils/wildfire/fetch/fetchProfile";
import { fetchTags } from "~~/utils/wildfire/fetch/fetchTags";
import { fetchUser } from "~~/utils/wildfire/fetch/fetchUser";

/**
 * useFeed HOOK
 * Use this to a video, plus feed
 **/
export const useShortsTips = (limit: any) => {
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
