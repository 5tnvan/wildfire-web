"use server";

import { createClient } from "~~/utils/supabase/server";

/**
 * FETCH: fetchRandomFeed()
 * DB: supabase
 * TABLE: "3sec_desc_view"
 **/

export const fetchRandomFeed = async (limit: any) => {
  const supabase = createClient();
  const { data } = await supabase
    .from("long_form_random_view")
    .select(`*, profile:user_id(*), long_form_views(*)`)
    .limit(limit);

  return data;
};

/**
 * FETCH: fetchMostViewed()
 * DB: supabase
 * TABLE: "3sec_desc_view"
 **/
export const fetchLastestFeed = async (from: any, to: any) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("long_form_desc_view")
    .select(`*, profile:user_id(*), long_form_views(*)`)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("fetchLastestFeed", error);
    return null;
  }

  return data;
};

/**
 * FETCH: fetchMostViewedFeed()
 * DB: supabase
 * TABLE: "long_form_views"
 **/
export const fetchMostViewedFeed = async (from: any, to: any) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("long_form_view_count_view")
    .select(`*, long_form:video_id(*, profile:user_id(*))`)
    .order("view_count", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("fetchMostViewedFeed", error);
    return null;
  }

  return data;
};

/**
 * FETCH: fetchFeedAll()
 * DB: supabase
 * TABLE: "3sec_desc_view"
 **/

export const fetchUserVideoFeedAll = async (user_id: any) => {
  const supabase = createClient();
  const { data } = await supabase.from("long_form").select("id", { count: "exact" }).eq("user_id", user_id);

  console.log("fetchUserFeedAll", user_id, data);

  return data;
};

/**
 * FETCH: fetchUserVideoFeedWithRange()
 * DB: supabase
 * TABLE: "3sec_desc_view"
 **/

export const fetchUserVideoFeedWithRange = async (user_id: string, from: any, to: any) => {
  const supabase = createClient();
  const { data } = await supabase
    .from("long_form")
    .select(
      `*, profile:user_id(username),
      long_form_views(*)
      long_form_fires(*)
      long_form_comments(*, profile:user_id(username), long_form_replies:id(*, profile:user_id(id, username, avatar_url)))
      `,
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
    .from("long_form_desc_view")
    .select(
      `*, profile:user_id(username),
      long_form_views(*)
      long_form_fires(*)
      long_form_comments(*, profile:user_id(username), long_form_replies:id(*, profile:user_id(id, username, avatar_url)))
      `,
    )
    .in("user_id", followingArray)
    .range(from, to);

  return { data };
};
