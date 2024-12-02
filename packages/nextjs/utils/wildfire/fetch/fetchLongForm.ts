"use server";

import { createClient } from "~~/utils/supabase/server";

/**
 * FETCH: fetch3Sec()
 * DB: supabase
 * TABLE: "3sec"
 **/

export const fetchLastLongFormVideoPosts = async (user_id: any) => {
  const supabase = createClient();
  const { data } = await supabase
    .from("long_form")
    .select("id, created_at")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .limit(6);

  return data;
};
