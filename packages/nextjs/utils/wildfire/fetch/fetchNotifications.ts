"use server";

import { createClient } from "~~/utils/supabase/server";

/**
 * FETCH: fetchFollowersNotifications()
 * DB: supabase
 * TABLE: notifications
 * RETURN: { data }
 **/

export const fetchFollowersNotifications = async (user_id: any) => {
  const supabase = createClient();
  try {
    const { data } = await supabase
      .from("notifications")
      .select("*, follower:follower_id(id, username, avatar_url)")
      .eq("user_id", user_id)
      .order("follower_created_at", { ascending: false });
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return null;
  }
};

export const fetchFiresNotifications = async (user_id: any) => {
  const supabase = createClient();
  try {
    const { data } = await supabase
      .from("notifications_fires")
      .select("*, liker:liked_by(id, username, avatar_url)")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return null;
  }
};

export const fetchCommentsNotifications = async (user_id: any) => {
  const supabase = createClient();
  try {
    const { data } = await supabase
      .from("notifications_comments")
      .select("*, commenter:commented_by(id, username, avatar_url)")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return null;
  }
};

export const fetchRepliesNotifications = async (user_id: any) => {
  const supabase = createClient();
  try {
    const { data } = await supabase
      .from("notifications_replies")
      .select("*, replier:reply_by(id, username, avatar_url)")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });
      console.log("heyyyy", data);
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return null;
  }
};

export const fetchTipsNotifications = async (user_id: any) => {
  const supabase = createClient();
  try {
    const { data } = await supabase
      .from("notifications_tips")
      .select("*, 3sec_tips(*, tipper:wallet_id(id, username, avatar_url))")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return null;
  }
};

export const fetchDirectTipsNotifications = async (user_id: any) => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("notifications_direct_tips")
      .select(`
        *,
        direct_tips (*,
          tipper:wallet_id_from (id, username, avatar_url),
          tipped:wallet_id_to (id, username, avatar_url)
        )
      `)
      .order("created_at", { ascending: false })
      .filter("direct_tips.tipped.id", "eq", user_id); // Apply filter on wallet_id_to

    if (error) throw error;

    console.log("juuu", data);

    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return null;
  }
};
