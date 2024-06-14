"use server";

import { createClient } from "~~/utils/supabase/server";

/**
 * FETCH: fetchFeedWithRange()
 * DB: supabase
 * TABLE: "3sec_desc_view"
 **/

export const fetchFeedWithRange = async (from: any, to: any) => {
  const supabase = createClient();
  const { data } = await supabase
    .from("3sec_desc_view")
    .select(
      "id, thumbnail_url, video_url, created_at, country:country_id(id, name), profile:user_id(id, username, avatar_url), 3sec_views(view_count), 3sec_fires(count), 3sec_comments(*, profile:user_id(id, username, avatar_url))",
    )
    .range(from, to);

  return data;
};

/**
 * FETCH: fetchFeedAll()
 * DB: supabase
 * TABLE: "3sec_desc_view"
 **/

export const fetchUserFeedAll = async (user_id: any) => {
  const supabase = createClient();
  const { data } = await supabase
    .from("3sec")
    .select(
      "id, thumbnail_url, video_url, created_at, country:country_id(name), profile:user_id(id, username, avatar_url), 3sec_views(view_count), 3sec_fires(count), 3sec_comments(*, profile:user_id(id, username, avatar_url))",
    )
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

    console.log("fetchUserFeedAll", user_id, data);

  return data;
};

/**
 * FETCH: fetchUserFeedWithRange()
 * DB: supabase
 * TABLE: "3sec_desc_view"
 **/

export const fetchUserFeedWithRange = async (user_id: string, from: any, to: any) => {
  console.log("fetchUserFeedWithRange", user_id, from, to);
  const supabase = createClient();
  const { data } = await supabase
    .from("3sec")
    .select(
      "id, thumbnail_url, video_url, created_at, country:country_id(name), profile:user_id(id, username, avatar_url), 3sec_views(view_count), 3sec_fires(count), 3sec_comments(*, profile:user_id(id, username, avatar_url))",
    )
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .range(from, to);

  return data;
};

/**
 * FETCH: fetchUserFeedFromArrayOfFollowing()
 * DB: supabase
 * TABLE: "3sec_desc_view"
 **/
export const fetchUserFeedFromArrayOfFollowing = async (followingArray: any, from: number, to: number) => {
  const supabase = createClient();
  const { data } = await supabase
    .from("3sec_desc_view")
    .select(
      "id, thumbnail_url, video_url, created_at, country:country_id(name), profile:user_id(id, username, avatar_url), 3sec_views(view_count), 3sec_fires(count), 3sec_comments(*, profile:user_id(id, username, avatar_url))",
    )
    .in("user_id", followingArray)
    .range(from, to);

  return { data };
};
