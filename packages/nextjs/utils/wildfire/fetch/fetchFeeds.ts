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
    .from("3sec_random_view")
    .select(
      "id, thumbnail_url, video_url, created_at, country:country_id(id, name), profile:user_id(id, username, avatar_url, wallet_id), 3sec_tips(created_at, network, transaction_hash, amount, currency, comment), 3sec_views(view_count), 3sec_fires(count), 3sec_comments(*, profile:user_id(id, username, avatar_url))",
      {count : 'exact'}
    )
    .neq("suppressed", true)
    .limit(limit);

  return data;
};

/**
 * FETCH: fetchFeedWithRange()
 * DB: supabase
 * TABLE: "3sec_desc_view"
 **/

export const fetchVideoAndRandomFeed = async (video_id:any, limit:any) => {
  const supabase = createClient();
  const { data: data1 } = await supabase
    .from("3sec")
    .select(
      "id, thumbnail_url, video_url, created_at, country:country_id(id, name), profile:user_id(id, username, avatar_url, wallet_id), 3sec_tips(id, created_at, network, transaction_hash, amount, currency, comment, tipper:wallet_id(id, username, avatar_url)), 3sec_views(view_count), 3sec_fires(count), 3sec_comments(*, profile:user_id(id, username, avatar_url))",
    )
    .eq("id", video_id)
    .single();

    const { data: data2 } = await supabase
    .from("3sec_random_view")
    .select(
      "id, thumbnail_url, video_url, created_at, country:country_id(id, name), profile:user_id(id, username, avatar_url, wallet_id), 3sec_tips(id, created_at, network, transaction_hash, amount, currency, comment, tipper:wallet_id(id, username, avatar_url)), 3sec_views(view_count), 3sec_fires(count), 3sec_comments(*, profile:user_id(id, username, avatar_url))",
    )
    .neq("suppressed", true)
    .neq("id", video_id)
    .limit(limit-1)

    const combinedData = data2 ? [data1, ...data2] : data2;
  
  return combinedData;
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
      "id, thumbnail_url, video_url, created_at, country:country_id(name), profile:user_id(id, username, avatar_url, wallet_id), 3sec_views(view_count), 3sec_fires(count), 3sec_comments(*, profile:user_id(id, username, avatar_url))",
    )
    .eq("user_id", user_id)
    .limit(3)
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
      "id, thumbnail_url, video_url, created_at, country:country_id(name), profile:user_id(id, username, avatar_url, wallet_id), 3sec_views(view_count), 3sec_fires(count), 3sec_comments(*, profile:user_id(id, username, avatar_url))",
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
      "id, thumbnail_url, video_url, created_at, country:country_id(name), profile:user_id(id, username, avatar_url, wallet_id), 3sec_views(view_count), 3sec_fires(count), 3sec_comments(*, profile:user_id(id, username, avatar_url))",
    )
    .in("user_id", followingArray)
    .range(from, to);

  return { data };
};
