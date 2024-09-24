"use client";

import { useEffect, useState } from "react";

import { fetchRequestAccountDelete } from "@/utils/wildfire/fetch/fetchAccount";
import { User } from "@supabase/supabase-js";

/**
 * USEPROFILE HOOK
 * Use this to get currently authenticated user's profile
 **/
export const useUserAccount = (user: User | null) => {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true); // Set loading to true when starting data fetch

      if (user) {
        const res = await fetchRequestAccountDelete(user.id);
        setAccount(res);
      }

      setLoading(false); // Set loading to false when fetch is complete
    })();
  }, [triggerRefetch, user]);

  const refetch = () => setTriggerRefetch(prev => !prev);

  return { loading, account, refetch };
};
