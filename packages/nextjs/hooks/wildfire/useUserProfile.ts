"use client";

import { useEffect, useState } from "react";
import { fetchSuperProfile } from "~~/utils/wildfire/fetch/fetchProfile";
import { fetchUser } from "~~/utils/wildfire/fetch/fetchUser";

/**
 * useUserProfile HOOK
 * Use this to get currently authenticated user's profile
 **/
export const useUserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch(prev => !prev);
  };

  const init = async () => {
    setLoading(true);

    const res = await fetchUser();

    if (res.user) {
      const profileData = await fetchSuperProfile(res.user);
      setProfile(profileData);
    }
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { loading, profile, refetch };
};
