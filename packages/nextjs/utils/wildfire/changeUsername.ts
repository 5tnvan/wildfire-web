import { createClient } from "~~/utils/supabase/client";
import { fetchUser } from "./fetch/fetchUser";


export async function updateUsername(newUsername: any) {
  const supabase = createClient();
  const user = await fetchUser();
  const { error } = await supabase
    .from("profiles")
    .update({ username: newUsername, updated_at: new Date() })
    .eq("id", user?.user?.id)

  return error;
}

export async function isUsernameTaken(username: string) {
  const supabase = createClient();
  const { data } = await supabase.from("profiles").select("*").eq("username", username);

  return !!(data?.length ?? 0);
}

export async function isUsernameUpdated(username: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("updated_at")
    .eq("username", username)
    .single(); // Use .single() to get a single record

  if (error || !data) {
    return null; // Return null if there is an error or no data found
  }

  return data.updated_at;
}
