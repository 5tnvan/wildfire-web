"use server";

import { createClient } from "~~/utils/supabase/server";

export async function insertReply(comment_id: any, comment: any) {
  const supabase = createClient();

  //get user from supabase db
  const { data: user } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("3sec_replies")
    .insert({ comment_id: comment_id, user_id: user.user?.id, reply: comment });

  if (error) {
    console.log("insertReply", error);
    return error;
  }
}
