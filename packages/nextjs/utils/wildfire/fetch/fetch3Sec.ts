"use server";

import { createClient } from "@/utils/supabase/server";

import { fetchLiked } from "./fetchLikes";

/**
 * FETCH: fetch3Sec()
 * DB: supabase
 * TABLE: "3sec"
 **/

export const fetch3Sec = async (video_id: any, user_id: any) => {
  const supabase = createClient();
  const { data } = await supabase
    .from("3sec")
    .select("3sec_views(view_count), 3sec_fires(count), 3sec_comments(*, profile:user_id(id, username, avatar_url))")
    .eq("id", video_id)
    .single();

  const liked = await fetchLiked(video_id, user_id);

  // Add liked property to the data object
  const result = { ...data, liked };

  console.log("fetch3Sec", result);

  return result;
};

/**
 * FETCH: fetchLevel()
 * DB: supabase
 * TABLE: "3sec"
 **/

export const fetchLevel = async (user_id: any) => {
  const supabase = createClient();
  // Fetch level (if data returns, setLevel to 1, otherwise leave level as 0)
  const { data } = await supabase.from("levels").select("level").eq("user_id", user_id).single();

  return data;
};

/**
 * FETCH: fetch3Sec()
 * DB: supabase
 * TABLE: "3sec"
 **/

export const fetchLastVideoPosts = async (user_id: any) => {
  const supabase = createClient();
  const { data } = await supabase
    .from("3sec")
    .select("id, created_at")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .limit(6);

  return data;
};
