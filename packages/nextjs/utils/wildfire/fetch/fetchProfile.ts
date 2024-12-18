"use server";

import { User } from "@supabase/supabase-js";
import { fetchUser } from "./fetchUser";
import { createClient } from "~~/utils/supabase/server";

/**
 * FETCH: fetchProfile()
 * DB: supabase
 * TABLE: "profiles"
 **/

export const fetchSuperProfile = async (user: User) => {
  const supabase = createClient();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*, levels(id, level, created_at)")
      .eq("id", user.id);
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
  const { data: profileData } = await supabase
    .from("profiles")
    .select("*, levels(id, level, created_at)")
    .eq("username", username)
    .limit(1);
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

/**
 * FETCH: fetchProfileFromWalletId(wallet_id)
 * DB: supabase
 * TABLE: "profiles"
 **/

export const fetchProfileFromWalletId = async (wallet_id: string) => {
  const supabase = createClient();

  const { data: profileData, error } = await supabase.from("profiles").select("*").ilike("wallet_id", wallet_id);
  if (error) console.log(error);
  return profileData?.[0] ?? null;
};
