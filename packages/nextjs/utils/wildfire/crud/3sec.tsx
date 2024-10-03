"use server";

import { createClient } from "@/utils/supabase/server";

export async function insertVideo(video_url: any, thumbnail_url: any, country_id: any) {
  const supabase = createClient();

  //get user from supabase db
  const { data: user } = await supabase.auth.getUser();

  const { data, error } = await supabase.from("3sec")
  .insert({
    user_id: user.user?.id,
    video_url: video_url,
    thumbnail_url: thumbnail_url,
    country_id: country_id,
  })
  .select();

  if (error) {
    console.log("insertVideo", error);
    return error;
  }

  return data;
}

export async function upsertVideo(id: any, playback_id: any, user_id: any) {
  const supabase = createClient();

  const { error } = await supabase.from("3sec").upsert({
    id,
    playback_id,
    user_id
  });

  if (error) {
    console.log("upsertVideo", error);
    return error;
  }
}
