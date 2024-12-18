"use server";

import { createClient } from "~~/utils/supabase/server";

export const fetchTags = async (limit: any) => {
  const supabase = createClient();
  const { data } = await supabase
    .from("tags_random_view")
    .select(
      `*`,
    )
    .limit(limit);

  return data;
};
