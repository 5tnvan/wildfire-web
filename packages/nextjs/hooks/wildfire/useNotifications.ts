"use client";

import { useEffect, useState } from "react";
import { createClient } from "~~/utils/supabase/client";
import { fetchCommentsNotifications, fetchDirectTipsNotifications, fetchFiresNotifications, fetchFollowersNotifications, fetchRepliesNotifications, fetchTipsNotifications } from "~~/utils/wildfire/fetch/fetchNotifications";
import { fetchUser } from "~~/utils/wildfire/fetch/fetchUser";

/**
 *  HOOK
 * Use this to get notification data of currently authenticated user
 **/
export const useNotifications = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>();
  const [followersNotifications, setFollowersNotifications] = useState<any>();
  const [firesNotifications, setFiresNotifications] = useState<any>();
  const [commentsNotifications, setCommentsNotifications] = useState<any>();
  const [repliesNotifications, setRepliesNotifications] = useState<any>();
  const [tipsNotifications, setTipsNotifications] = useState<any>();
  const [directTipsNotifications, setDirectTipsNotifications] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);
  const supabase = createClient();

  const refetch = () => {
    setTriggerRefetch(prev => !prev); //toggle triggerRefetch to false/true
  };

  const init = async () => {
    setIsLoading(true);
    const user = await fetchUser();
    if (user.user?.id) {
      setUser(user);
      const followersNotificationsRes = await fetchFollowersNotifications(user?.user?.id);
      const firesNotificationsRes = await fetchFiresNotifications(user?.user?.id);
      const commentsNotificationsRes = await fetchCommentsNotifications(user?.user?.id);
      const repliesNotificationsRes = await fetchRepliesNotifications(user?.user?.id);
      const tipsNotificationsRes = await fetchTipsNotifications(user?.user?.id);
      const directTipsNotificationsRes = await fetchDirectTipsNotifications(user?.user?.id);
      setFollowersNotifications(followersNotificationsRes);
      setFiresNotifications(firesNotificationsRes);
      setCommentsNotifications(commentsNotificationsRes);
      setRepliesNotifications(repliesNotificationsRes);
      setTipsNotifications(tipsNotificationsRes);
      setDirectTipsNotifications(directTipsNotificationsRes);
    }
    setIsLoading(false);
  };

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
  const handleRepliesChange = (payload: any) => {
    console.log("Change received!", payload);
    refetch();
  };
  const handleTipsChange = (payload: any) => {
    console.log("Change received!", payload);
    refetch();
  };
  const handleDirectTipsChange = (payload: any) => {
    console.log("Change received!", payload);
    refetch();
  };

  //LISTEN TO REALTIME CHANGES
  supabase
    .channel("test")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user?.user?.id}` },
      handleFollowersChange,
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "notifications_fires", filter: `user_id=eq.${user?.user?.id}` },
      handleFiresChange,
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "notifications_comments", filter: `user_id=eq.${user?.user?.id}` },
      handleCommentsChange,
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "notifications_replies", filter: `user_id=eq.${user?.user?.id}` },
      handleRepliesChange,
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "notifications_tips", filter: `user_id=eq.${user?.user?.id}` },
      handleTipsChange,
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "notifications_direct_tips", filter: `user_id=eq.${user?.user?.id}` },
      handleDirectTipsChange,
    )
    .subscribe();

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { isLoading, followersNotifications, firesNotifications, commentsNotifications, repliesNotifications, tipsNotifications, directTipsNotifications, refetch };
};
