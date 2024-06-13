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
    setLoading(true); // Set loading to true when starting data fetch

    const userData = await fetchUser();
    if (userData?.user) {
      const profileData = await fetchSuperProfile();
      setProfile(profileData);
    }
    setLoading(false); // Set loading to false when fetch is complete
  };

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { loading, profile, refetch };
};
