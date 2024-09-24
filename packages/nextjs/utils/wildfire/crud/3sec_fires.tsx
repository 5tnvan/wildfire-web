"use server";

import { createClient } from "@/utils/supabase/server";

export async function insertLike(user_id: any, video_id: any) {
  const supabase = createClient();

  const { error } = await supabase.from("3sec_fires").insert({
    video_id: video_id,
    user_id,
    fire: true,
  });

  if (error) {
    console.log("insertLike", error);
    return error;
  }
}
