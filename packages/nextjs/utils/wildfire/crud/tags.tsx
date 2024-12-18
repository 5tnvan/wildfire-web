"use server";

import { createClient } from "~~/utils/supabase/server";

export async function fetchTag(tag: string) {
  const supabase = createClient();

  const { data } = await supabase
    .from("tags")
    .select()
    .eq('tag', tag)

    if(data?.length) 
      return data[0].id; 
    else return null;
}

export async function insertTag(tag: string) {
  const supabase = createClient();

  const { data } = await supabase
    .from("tags")
    .insert({tag_name: tag})
    .select();

  if(data?.length) 
      return data[0].id; 
    else return null;
}