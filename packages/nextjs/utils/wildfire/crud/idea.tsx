"use server";

import { createClient } from "~~/utils/supabase/server";

export async function insertIdea(text: string) {
  const supabase = createClient();

  const { data: user } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("idea")
    .insert({
      text: text,
      user_id: user.user?.id,
    })
    .select();

    if(data && data.length > 0) {
      return data[0].id;
    } else {
      return null
    }
}

export async function updateIdeaArchived(idea_id: any) {
  console.log("idea_id", idea_id);
  const supabase = createClient();

  const { error } = await supabase
    .from("idea")
    .update({
      archived: true,
    })
    .eq("id", idea_id)
    .select();

    if(error) console.log("updateIdea", error);

    return error;
}