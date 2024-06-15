"use server";

import { fetchLiked, fetchLikes } from "./fetchLikes";
import { createClient } from "~~/utils/supabase/server";

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
