"use server";

import { createClient } from "~~/utils/supabase/server";

export async function requestDeleteAccount() {
  const supabase = createClient();

  //get user from supabase db
  const { data: user } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("user_request_delete")
    .insert({
      user_id: user.user?.id,
      delete_account: true,
      delete_data: true,
    })
    .select();

  if (error) {
    console.log(error);
    throw new Error();
  }
}

export async function requestDeleteData() {
  const supabase = createClient();

  //get user from supabase db
  const { data: user } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("user_request_delete")
    .insert({
      user_id: user.user?.id,
      delete_account: false,
      delete_data: true,
    })
    .select();

  if (error) {
    console.log(error);
    throw new Error();
  }
}
