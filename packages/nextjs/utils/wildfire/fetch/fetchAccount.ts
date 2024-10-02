"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * FETCH: fetchProfile()
 * DB: supabase
 * TABLE: "profiles"
 **/

export const fetchRequestAccountDelete = async (user_id: any) => {
  console.log("user_id", user_id);
  const supabase = createClient();
  const { data } = await supabase.from("user_request_delete").select().eq("user_id", user_id);
  return data;
};
