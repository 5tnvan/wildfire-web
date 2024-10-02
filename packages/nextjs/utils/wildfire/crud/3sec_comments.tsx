"use server";

import { createClient } from "@/utils/supabase/server";

export async function insertComment(user_id: any, video_id: any, comment: any) {
  const supabase = createClient();

  const { error } = await supabase.from("3sec_comments").insert({ video_id: video_id, user_id, comment: comment });

  if (error) {
    console.log("insertComment", error);
    return error;
  }
}
