import { useEffect, useState } from "react";

import { User } from "@supabase/supabase-js";

import { fetchUser } from "@/utils/wildfire/fetch/fetchUser";

/**
 * USEAUTH HOOK
 * Use this to check if user is authenticated, with basic user's data
 **/
export const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);

      console.log("asdfsadfsadf");
      const userResp = await fetchUser();

      if (userResp && userResp?.user) {
        setIsAuthenticated(true);
        setUser(userResp.user);
      } else {
        setIsAuthenticated(false);
      }

      setLoading(false);
    })();
  }, [triggerRefetch]);

  const refetch = () => setTriggerRefetch(prev => !prev);

  return { loading, isAuthenticated, user, refetch };
};
