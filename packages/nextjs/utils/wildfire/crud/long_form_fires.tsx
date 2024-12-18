"use server";

import { createClient } from "~~/utils/supabase/server";

export async function insertLike(video_id: any, type: string) {
  const supabase = createClient();

  const { data: user } = await supabase.auth.getUser();

  const updateField = {
    [type]: true,
  };

  // Perform the upsert
  const { error } = await supabase.from("long_form_fires").upsert({
    video_id: video_id,
    user_id: user.user?.id,
    ...updateField,
  });

  if (error) {
    console.log("insertLike", error);
    return error;
  }
}
