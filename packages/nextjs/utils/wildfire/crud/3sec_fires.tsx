"use server";

import { createClient } from "~~/utils/supabase/server";

export async function insertLike(video_id: any) {
  const supabase = createClient();

  //get user from supabase db
  const { data: user } = await supabase.auth.getUser();

  const { error } = await supabase.from("3sec_fires").insert({
    video_id: video_id,
    user_id: user.user?.id,
    fire: true,
  });

  if (error) {
    console.log("insertLike", error);
    return error;
  }
}
