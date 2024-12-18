"use server";

import { createClient } from "~~/utils/supabase/server";

export async function insertIdeaTag(idea_id: any, tag_id: any) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("idea_tags")
    .insert({
      idea_id,
      tag_id
    })
    .select();

  if (error) {
    console.log("insertIdea", error);
    return error;
  }

  return data;
}