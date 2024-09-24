"use client";

import { useEffect, useState } from "react";

import { User } from "@supabase/supabase-js";

import { fetchFollowed, fetchFollowers, fetchFollowing } from "@/utils/wildfire/fetch/fetchFollows";

import { fetchProfileByUsername } from "../../utils/wildfire/fetch/fetchProfile";

/**
 * USEPROFILE HOOK
 * Use this to get user's follow data, given a username
 **/
export const useUserFollowsByUsername = (user: User | null, username: any) => {
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState<any>();
  const [following, setFollowing] = useState<any>();
  const [followed, setFollowed] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true); // Set loading to true when starting data fetch

      const profile = await fetchProfileByUsername(username);
      if (profile) {
        const followers = await fetchFollowers(profile.id);
        const following = await fetchFollowing(profile.id);
        const followed = await fetchFollowed(user?.id, profile.id);
        setFollowers(followers);
        setFollowing(following);
        setFollowed(followed);
      }
      setLoading(false); // Set loading to false when fetch is complete
    })();
  }, [triggerRefetch, user, username]);

  const refetch = () => setTriggerRefetch(prev => !prev);

  return { loading, followers, following, followed, refetch };
};
