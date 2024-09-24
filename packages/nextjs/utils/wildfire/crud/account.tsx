"use server";

import { createClient } from "@/utils/supabase/server";

export async function requestDeleteAccount(user_id: any) {
  const supabase = createClient();

  const { error } = await supabase
    .from("user_request_delete")
    .insert({
      user_id,
      delete_account: true,
      delete_data: true,
    })
    .select();

  if (error) {
    console.log(error);
    throw new Error();
  }
}

export async function requestDeleteData(user_id: any) {
  const supabase = createClient();

  const { error } = await supabase
    .from("user_request_delete")
    .insert({
      user_id,
      delete_account: false,
      delete_data: true,
    })
    .select();

  if (error) {
    console.log(error);
    throw new Error();
  }
}
