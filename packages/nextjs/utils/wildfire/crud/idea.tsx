"use server";

import { createClient } from "~~/utils/supabase/server";

export async function insertIdea(text: string) {
  const supabase = createClient();

  const { data: user } = await supabase.auth.getUser();

  const { data, error } = await supabase
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