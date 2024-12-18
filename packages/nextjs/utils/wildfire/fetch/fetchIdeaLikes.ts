"use server";

import { createClient } from "~~/utils/supabase/server";

/**
 * FETCH: fetchLikes()
 * DB: supabase
 * TABLE: "3sec_fires"
 **/

export const fetchLikes = async (user_id: any, idea_id: any) => {

  const supabase = createClient();
  const { data: res } = await supabase
    .from("idea_fires")
    .select()
    .eq("user_id", user_id)
    .eq("idea_id", idea_id)
    .single();

  return res;
};
