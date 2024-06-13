"use client";

import { useEffect, useState } from "react";
import { fetchProfileByUsername } from "../../utils/wildfire/fetch/fetchProfile";

/**
 * USEPROFILE HOOK
 * Use this to get currently authenticated user's profile
 **/
export const useUserProfileByUsername = (username: any) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch(prev => !prev);
  };

  const init = async () => {
    setLoading(true); // Set loading to true when starting data fetch

    const res = await fetchProfileByUsername(username);
    if (res) {
      setProfile(res);
    }
    setLoading(false); // Set loading to false when fetch is complete
  };

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { loading, profile, refetch };
};
