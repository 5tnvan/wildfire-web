"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * FETCH: fetchFollowers()
 * DB: supabase
 * TABLE: "follows"
 **/

export const incrementViews = async (video_id: any) => {
  console.log("incremented views", video_id);
  const supabase = createClient();
  const { error } = await supabase.rpc("3sec_views_increment", {
    p_video_id: video_id,
  });
  if (error) console.log("error increment_views", error);
};
