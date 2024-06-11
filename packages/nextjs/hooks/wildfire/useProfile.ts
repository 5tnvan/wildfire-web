"use client";

import { useEffect, useState } from "react";
import { fetchRequestAccountDelete } from "~~/utils/wildfire/fetch/fetchAccount";
import { fetchSuperProfile } from "~~/utils/wildfire/fetch/fetchProfile";
import { fetchUser } from "~~/utils/wildfire/fetch/fetchUser";

/**
 * USEPROFILE HOOK
 * Use this to get currently authenticated user's profile
 **/
export const useProfile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>();
  const [account, setAccount] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch(prev => !prev);
  };

  const init = async () => {
    setLoading(true); // Set loading to true when starting data fetch

    const userData = await fetchUser();
    if (userData?.user) {
      const profileData = await fetchSuperProfile();
      const res = await fetchRequestAccountDelete(userData?.user.id);
      setProfile(profileData);
      setAccount(res);
    }
    setLoading(false); // Set loading to false when fetch is complete
  };

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { loading, profile, account, refetch };
};
