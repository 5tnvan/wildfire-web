"use client";

import { useEffect, useState } from "react";

import { User } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/client";
import {
  fetchCommentsNotifications,
  fetchFiresNotifications,
  fetchFollowersNotifications,
  fetchTipsNotifications,
} from "@/utils/wildfire/fetch/fetchNotifications";

/**
 *  HOOK
 * Use this to get notification data of currently authenticated user
 **/
export const useNotifications = (user: User | null) => {
  const [isLoading, setIsLoading] = useState(true);
  const [followersNotifications, setFollowersNotifications] = useState<any>();
  const [firesNotifications, setFiresNotifications] = useState<any>();
  const [commentsNotifications, setCommentsNotifications] = useState<any>();
  const [tipsNotifications, setTipsNotifications] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    //LISTEN TO REALTIME CHANGES
    supabase
      .channel("test")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user?.id}` },
        handleFollowersChange,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications_fires", filter: `user_id=eq.${user?.id}` },
        handleFiresChange,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications_comments", filter: `user_id=eq.${user?.id}` },
        handleCommentsChange,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications_tips", filter: `user_id=eq.${user?.id}` },
        handleTipsChange,
      )
      .subscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      if (user?.id) {
        const followersNotificationsRes = await fetchFollowersNotifications(user?.id);
        const firesNotificationsRes = await fetchFiresNotifications(user?.id);
        const commentsNotificationsRes = await fetchCommentsNotifications(user?.id);
        const tipsNotificationsRes = await fetchTipsNotifications(user?.id);
        setFollowersNotifications(followersNotificationsRes);
        setFiresNotifications(firesNotificationsRes);
        setCommentsNotifications(commentsNotificationsRes);
        setTipsNotifications(tipsNotificationsRes);
      }

      setIsLoading(false);
    })();
  }, [triggerRefetch, user]);

  //REFETCH WHEN NEW NOTIF DETECTED
  const handleFollowersChange = (payload: any) => {
    console.log("Change received!", payload);
    refetch();
  };

  const handleFiresChange = (payload: any) => {
    console.log("Change received!", payload);
    refetch();
  };

  const handleCommentsChange = (payload: any) => {
    console.log("Change received!", payload);
    refetch();
  };

  const handleTipsChange = (payload: any) => {
    console.log("Change received!", payload);
    refetch();
  };

  const refetch = () => setTriggerRefetch(prev => !prev);

  return { isLoading, followersNotifications, firesNotifications, commentsNotifications, tipsNotifications, refetch };
};
