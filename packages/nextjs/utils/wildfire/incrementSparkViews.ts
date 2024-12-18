"use server";

import { createClient } from "~~/utils/supabase/server";

/**
 * FETCH: fetchFollowers()
 * DB: supabase
 * TABLE: "follows"
 **/

export const incrementSparkViews = async (idea_id: any) => {
  console.log("incremented views", idea_id);
  const supabase = createClient();
  const { error } = await supabase.rpc("idea_views_increment", {
    p_idea_id: idea_id,
  });
  if (error) console.log("error increment_views", error);
};