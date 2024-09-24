"use server";

import { createClient } from "@/utils/supabase/server";

export async function insertVideo(user_id: any, playback_id: any, country_id: any) {
  const supabase = createClient();

  const { error } = await supabase.from("3sec").insert({
    user_id,
    playback_id,
    country_id,
  });

  if (error) {
    console.log("insertVideo", error);
    return error;
  }
}
