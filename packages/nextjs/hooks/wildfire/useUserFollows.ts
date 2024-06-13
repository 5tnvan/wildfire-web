"use client";

import { useEffect, useState } from "react";
import { fetchFollowers, fetchFollowing } from "~~/utils/wildfire/fetch/fetchFollows";
import { fetchUser } from "~~/utils/wildfire/fetch/fetchUser";

/**
 * useUserFollows HOOK
 * Use this to get currently authenticated user's follows
 **/
export const useUserFollows = () => {
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState<any>();
  const [following, setFollowing] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch(prev => !prev);
  };

  const init = async () => {
    setLoading(true); // Set loading to true when starting data fetch

    const userData = await fetchUser();
    if (userData?.user) {
      const followers = await fetchFollowers(userData?.user.id);
      const following = await fetchFollowing(userData?.user.id);
      setFollowers(followers);
      setFollowing(following);
    }
    setLoading(false); // Set loading to false when fetch is complete
  };

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { loading, followers, following, refetch };
};
