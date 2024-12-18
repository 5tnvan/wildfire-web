"use client";

import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { fetchRequestAccountDelete } from "~~/utils/wildfire/fetch/fetchAccount";
import { fetchUser } from "~~/utils/wildfire/fetch/fetchUser";

/**
 * USEPROFILE HOOK
 * Use this to get currently authenticated user's profile
 **/
export const useUserAccount = () => {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch(prev => !prev);
  };

  const init = async () => {
    setLoading(true);
    const res = await fetchUser();
    if (res.user) {
      const res2 = await fetchRequestAccountDelete(res.user.id);
      setAccount(res2);
    }
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { loading, account, refetch };
};
