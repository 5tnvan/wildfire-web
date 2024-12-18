"use server";

import { createClient } from "~~/utils/supabase/server";

/**
 * FETCH: fetchLikes()
 * DB: supabase
 * TABLE: "3sec_fires"
 **/

export const fetchLikes = async (user_id: any, video_id: any) => {
  const supabase = createClient();
  const { data: res } = await supabase
    .from("long_form_fires")
    .select()
    .eq("user_id", user_id)
    .eq("video_id", video_id)
    .single();

  return res;
};
