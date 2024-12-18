"use server";

import { createClient } from "~~/utils/supabase/server";

export async function insertVideo(title: string, description: string, video_url: any, thumbnail_url: any, country_id: any) {
  const supabase = createClient();

  //get user from supabase db
  const { data: user } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("long_form")
    .insert({
      title: title,
      description: description,
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

  const { error } = await supabase.from("long_form").upsert({
    id,
    playback_id,
    user_id,
  });

  if (error) {
    console.log("upsertVideo", error);
    return error;
  }
}

export async function updateApprove(id: any) {
  const supabase = createClient();
  const { error } = await supabase.from("long_form").update({ suppressed: false }).eq("id", id);

  if (error) {
    console.log("updateApprove", error);
    return error;
  }
}

export async function updateView(id: any, view: number) {
  console.log("id, view", id, view);
  const supabase = createClient();
  const { data, error } = await supabase.from("long_form").update({ view_count: view }).eq("video_id", id);

  if (error) {
    console.log("updateView", error);
    return false;
  }

  return true;
}
