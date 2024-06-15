"use client";

import { useEffect, useState } from "react";
import { fetchProfileByUsername } from "../../utils/wildfire/fetch/fetchProfile";
import { fetchFollowed, fetchFollowers, fetchFollowing } from "~~/utils/wildfire/fetch/fetchFollows";
import { fetchUser } from "~~/utils/wildfire/fetch/fetchUser";

/**
 * USEPROFILE HOOK
 * Use this to get user's follow data, given a username
 **/
export const useUserFollowsByUsername = (username: any) => {
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState<any>();
  const [following, setFollowing] = useState<any>();
  const [followed, setFollowed] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch(prev => !prev);
  };

  const init = async () => {
    setLoading(true); // Set loading to true when starting data fetch

    const user = await fetchUser();
    const profile = await fetchProfileByUsername(username);
    if (profile) {
      const followers = await fetchFollowers(profile.id);
      const following = await fetchFollowing(profile.id);
      const followed = await fetchFollowed(user.user?.id, profile.id);
      setFollowers(followers);
      setFollowing(following);
      setFollowed(followed);
    }
    setLoading(false); // Set loading to false when fetch is complete
  };

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { loading, followers, following, followed, refetch };
};
