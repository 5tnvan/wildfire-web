"use server";

import { createClient } from "~~/utils/supabase/server";

/**
 * FETCH: fetchFollowers()
 * DB: supabase
 * TABLE: "follows"
 **/

export const fetchFollowers = async (user_id: any) => {
  const supabase = createClient();
  const { data: followers } = await supabase
    .from("followers")
    .select("follower:follower_id(id, username, avatar_url, profile_bios(id))")
    .eq("following_id", user_id)
    .order("created_at", { ascending: false });

  return followers;
};

/**
 * FETCH: fetchFollowing()
 * DB: supabase
 * TABLE: "following"
 **/

export const fetchFollowing = async (user_id: any) => {
  const supabase = createClient();
  const { data: following } = await supabase
    .from("followers")
    .select("following:following_id(id, username, avatar_url, wallet_id, profile_bios(id)))")
    .eq("follower_id", user_id)
    .order("created_at", { ascending: false });

  return following;
};
