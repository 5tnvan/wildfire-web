"use client";

import { useEffect, useState } from "react";

import { User } from "@supabase/supabase-js";

import { fetchFollowed, fetchFollowers, fetchFollowing } from "@/utils/wildfire/fetch/fetchFollows";

/**
 * useUserFollows HOOK
 * Use this to get currently authenticated user's follows
 **/
export const useUserFollows = (user: User | null) => {
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState<any>();
  const [following, setFollowing] = useState<any>();
  const [followed, setFollowed] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true); // Set loading to true when starting data fetch

      if (user) {
        const followers = await fetchFollowers(user.id);
        const following = await fetchFollowing(user.id);
        const followed = await fetchFollowed(user.id, user.id);
        setFollowers(followers);
        setFollowing(following);
        setFollowed(followed);
      }

      setLoading(false); // Set loading to false when fetch is complete
    })();
  }, [triggerRefetch, user]);

  const refetch = () => setTriggerRefetch(prev => !prev);

  return { loading, followers, following, followed, refetch };
};
