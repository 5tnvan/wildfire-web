"use client";

import { useEffect, useState } from "react";

import { User } from "@supabase/supabase-js";

import { fetchSuperProfile } from "@/utils/wildfire/fetch/fetchProfile";

/**
 * useUserProfile HOOK
 * Use this to get currently authenticated user's profile
 **/
export const useUserProfile = (user: User | null) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true); // Set loading to true when starting data fetch

      if (user) {
        const profileData = await fetchSuperProfile(user);
        setProfile(profileData);
      }

      setLoading(false); // Set loading to false when fetch is complete
    })();
  }, [triggerRefetch, user]);

  const refetch = () => setTriggerRefetch(prev => !prev);

  return { loading, profile, refetch };
};
