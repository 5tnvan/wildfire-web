"use server";

import { createClient } from "~~/utils/supabase/server";

export const fetchIdea = async (idea_id: any) => {
  const supabase = createClient();
  const { data } = await supabase
    .from("idea")
    .select(
      `*, profile:user_id(username), 
      idea_views(*), 
      idea_fires(*),
      idea_comments(*, profile:user_id(username), idea_replies:id(*, profile:user_id(id, username, avatar_url)))`,
    )
    .eq("id", idea_id)
    .single();

  return data;
};
