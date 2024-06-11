"use client";

import { useEffect, useState } from "react";
import { fetchUser } from "~~/utils/wildfire/fetch/fetchUser";

/**
 * USEAUTH HOOK
 * Use this to check if user is authenticated, with basic user's data
 **/
export const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch(prev => !prev);
  };

  const init = async () => {
    setLoading(true);
    const res = await fetchUser();
    if (res && res?.user) {
      setIsAuthenticated(true);
      setUser(res.user);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { loading, isAuthenticated, user, refetch };
};
