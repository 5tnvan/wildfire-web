"use server";

import { createClient } from "~~/utils/supabase/server";

/**
 * FETCH: fetchRandomFeed()
 * DB: supabase
 * TABLE: "3sec"
 **/

export const fetchVideo = async (video_id: any) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("3sec")
    .select(
      "id, thumbnail_url, profile:user_id(username), country:country_id(id, name)"
    )
    .eq("id", video_id)
    .single();

  if (error) {
    console.error("Error fetching video:", error);
    return null;
  }

  return data;
};

