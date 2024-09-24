"use server";

import { createClient } from "@/utils/supabase/server";

export async function insertFollow(follower_id: any, following_id: any) {
  const supabase = createClient();

  const { error } = await supabase
    .from("followers")
    .insert({
      follower_id: follower_id,
      following_id: following_id,
    })
    .select();

  if (error) {
    console.log(error);
    return error;
  }
}

export async function deleteFollow(follower_id: any, following_id: any) {
  const supabase = createClient();

  const { error } = await supabase
    .from("followers")
    .delete()
    .eq("follower_id", follower_id)
    .eq("following_id", following_id);

  if (error) {
    console.log(error);
    return error;
  }
}
