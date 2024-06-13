"use client";

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
    setLoading(true); // Set loading to true when starting data fetch
    const userData = await fetchUser();
    if (userData?.user) {
      const res = await fetchRequestAccountDelete(userData?.user.id);
      setAccount(res);
    }
    setLoading(false); // Set loading to false when fetch is complete
  };

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { loading, account, refetch };
};
