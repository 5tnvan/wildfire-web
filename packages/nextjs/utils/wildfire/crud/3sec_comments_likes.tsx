"use server";

import { createClient } from "~~/utils/supabase/server";

export async function insertLikeComment(comment_id: any) {
  const supabase = createClient();

  //get user from supabase db
  const { data: user } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("3sec_comments_likes")
    .insert({ comment_id: comment_id, user_id: user.user?.id });

  if (error) {
    console.log("insertLikeComment", error);
    return error;
  }
}
