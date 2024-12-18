"use server";

import { createClient } from "~~/utils/supabase/server";

export const fetch3SecTips = async (limit: any) => {
  const supabase = createClient();
  const { data } = await supabase
    .from("3sec_tips")
    .select(
      `*`,
    )
    .limit(limit);

  return data;
};
