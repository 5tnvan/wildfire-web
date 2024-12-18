"use client";

import { useEffect, useState } from "react";
import { fetchFollowed, fetchFollowers, fetchFollowing } from "~~/utils/wildfire/fetch/fetchFollows";
import { fetchUser } from "~~/utils/wildfire/fetch/fetchUser";

/**
 * useUserFollows HOOK
 * Use this to get currently authenticated user's follows
 **/
export const useUserFollows = () => {
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState<any>();
  const [following, setFollowing] = useState<any>();
  const [followed, setFollowed] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch(prev => !prev);
  };

  const init = async () => {
    setLoading(true);

    const res = await fetchUser();

    if (res.user) {
      const followers = await fetchFollowers(res.user.id);
      const following = await fetchFollowing(res.user.id);
      const followed = await fetchFollowed(res.user.id, res.user.id);
      setFollowers(followers);
      setFollowing(following);
      setFollowed(followed);
    }
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { loading, followers, following, followed, refetch };
};
