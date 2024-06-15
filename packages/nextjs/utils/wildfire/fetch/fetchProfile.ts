"use server";

import { fetchUser } from "./fetchUser";
import { createClient } from "~~/utils/supabase/server";

/**
 * FETCH: fetchProfile()
 * DB: supabase
 * TABLE: "profiles"
 **/

export const fetchSuperProfile = async () => {
  const supabase = createClient();
  const user = await fetchUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*, profile_bios(id, views, content, created_at, cta), levels(id, level, created_at)")
      .eq("id", user.user?.id);
    return profile?.[0] ?? null;
  } else {
    return null;
  }
};

/**
 * FETCH: fetchProfileFromUsername(username)
 * DB: supabase
 * TABLE: "profiles"
 **/

export const fetchProfileByUsername = async (username: string) => {
  const supabase = createClient();
  const { data: profileData } = await supabase.from("profiles").select("*").eq("username", username).limit(1);
  return profileData?.[0] ?? null;
};

/**
 * FETCH: fetchProfileMatching(username)
 * DB: supabase
 * TABLE: "profiles"
 **/

export const fetchProfileMatching = async (username: string) => {
  const supabase = createClient();
  const { data: profileData } = await supabase
    .from("profiles")
    .select("id, username, avatar_url")
    .like("username", `${username}%`);
  console.log("profileData", profileData);
  return profileData;
};