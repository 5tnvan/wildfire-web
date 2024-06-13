"use server";

import { createClient } from "~~/utils/supabase/server";

/**
 * FETCH: fetchLikes()
 * DB: supabase
 * TABLE: "3sec_fires"
 **/

export const fetchLikes = async (post: any, user_id: any) => {
  const supabase = createClient();
  const { data: liked } = await supabase
    .from("3sec_fires")
    .select()
    .eq("user_id", user_id)
    .eq("video_id", post.id)
    .single();

  return { ...post, liked: !!liked }; // Add a property 'liked' to each post indicating whether it's liked by the user
};
