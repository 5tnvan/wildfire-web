"use server";

import { redirect } from "next/navigation";
import { createClient } from "~~/utils/supabase/server";

/* LOGOUT */
export async function logout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error);
    throw new Error("Logout failed"); // Explicitly throw an error here
  } else {
    redirect("/");
  }
}
