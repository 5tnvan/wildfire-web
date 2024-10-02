"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * FETCH: fetchUser()
 * DB: supabase
 * TABLE: "auth.user"
 * RETURN: { userData }
 **/

export const fetchUser = async () => {
  const supabase = createClient();
  //fetch user from supabase db
  const { data: userData } = await supabase.auth.getUser();
  console.log("here here");
  return userData;
};

/**
 * FETCH: fetchProfile()
 * DB: supabase
 * TABLE: "profiles"
 **/

export const fetchProfile = async () => {
  const supabase = createClient();
  const userData = await fetchUser();

  if (userData) {
    const { data: profileData } = await supabase.from("profiles").select().eq("id", userData.user?.id);
    return profileData?.[0] ?? null;
  } else {
    return null;
  }
};

/**
 * FETCH: fetchProfilesWithRange()
 * DB: supabase
 * TABLE: "profiles"
 **/

export const fetchProfilesWithRange = async (from: any, to: any) => {
  const supabase = createClient();
  const { data: profileData } = await supabase.from("profiles_random_view").select(`*`).range(from, to);
  return profileData;
};

/**
 * FETCH: fetchPublicProfileMatchingWith(username)
 * DB: supabase
 * TABLE: "profiles"
 **/

export const fetchPublicProfileMatchingWith = async (username: string) => {
  const supabase = createClient();
  const { data: profileData } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, profile_bios(id)")
    .like("username", `${username}%`);
  console.log("profileData", profileData);
  return profileData;
};

/**
 * FETCH: fetchPublicProfileFromId(id)
 * DB: supabase
 * TABLE: "profiles"
 **/

export const fetchPublicProfileFromId = async (id: string) => {
  const supabase = createClient();
  const { data: profileData } = await supabase.from("profiles").select("*").eq("id", id);

  return profileData?.[0];
};

/**
 * FETCH: fetchPublicProfileFromWalletId(wallet_id)
 * DB: supabase
 * TABLE: "profiles"
 **/

export const fetchPublicProfileFromWalletId = async (wallet_id: string) => {
  const supabase = createClient();

  const { data: profileData, error } = await supabase.from("profiles").select("*").ilike("wallet_id", wallet_id);
  if (error) console.log(error);
  return profileData?.[0] ?? null;
};

/**
 * FETCH: fetchPublicProfileFromWalletId(wallet_id)
 * DB: supabase
 * TABLE: "profiles"
 **/

export const fetchAllBios = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, profile_bios (id, created_at, views, content, cta)")
    .order("created_at", { referencedTable: "profile_bios", ascending: true });
  if (error) console.log(error);
  return data;
};
