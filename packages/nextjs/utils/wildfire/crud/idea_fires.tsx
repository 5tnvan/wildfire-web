"use server";

import { createClient } from "~~/utils/supabase/server";

export async function insertLike(idea_id: any, type: string) {
  const supabase = createClient();

  const { data: user } = await supabase.auth.getUser();

  const updateField = {
    [type]: true,
  };

  // Perform the upsert
  const { error } = await supabase.from("idea_fires").upsert({
    idea_id: idea_id,
    user_id: user.user?.id,
    ...updateField,
  });

  if (error) {
    console.log("insertLike", error);
    return error;
  }
}
