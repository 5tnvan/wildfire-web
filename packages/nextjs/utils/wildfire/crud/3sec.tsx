"use server";

import { createClient } from "~~/utils/supabase/server";

export async function insertVideo(video_url: any, thumbnail_url: any, locationId: any) {
  const supabase = createClient();

  //get user from supabase db
  const { data: user } = await supabase.auth.getUser();

  const { data, error } = await supabase.from("3sec").insert({
    user_id: user.user?.id,
    video_url: video_url,
    thumbnail_url: thumbnail_url,
    country_id: locationId,
  });

  if (error) {
    console.log("insertVideo", error);
  }
  return data;
}
