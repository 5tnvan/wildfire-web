"use server";

import { createClient } from "~~/utils/supabase/server";

/**
 * FETCH: fetchVideo()
 * DB: supabase
 * TABLE: "3sec"
 **/

export const fetchVideo = async (video_id: any) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("long_form")
    .select(
      `*, profile:user_id(username), long_form_views(*), long_form_fires(*), long_form_comments(*, profile:user_id(*), long_form_replies:id(*, profile:user_id(id, username, avatar_url)))`,
    )
    .eq("id", video_id)
    .single();

  if (error) {
    console.error("Error fetching video:", error);
    return null;
  }

  return data;
};
