"use server";

import { createClient } from "~~/utils/supabase/server";

export async function insertComment(video_id: any, comment: any) {
  const supabase = createClient();

  //get user from supabase db
  const { data: user } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("long_form_comments")
    .insert({ video_id: video_id, user_id: user.user?.id, comment: comment });

  if (error) {
    console.log("insertComment", error);
    return error;
  }
}
