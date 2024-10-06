"use server";

import { createClient } from "@/utils/supabase/server";
import { any } from "zod";

/**
 * FETCH: fetchRandomFeed()
 * DB: supabase
 * TABLE: "3sec_desc_view"
 **/

export const fetchAll = async (limit: number, page: number = 0) => {
  const supabase = createClient();
  const from = page * limit;  // Calculate starting point
  const to = from + limit - 1; // Calculate ending point
  
  const { data, error } = await supabase
    .from("3sec_desc_view")
    .select(
      `id, playback_id, created_at,
       video_url, thumbnail_url, 
       country:country_id(id, name), 
       profile:user_id(id, username, avatar_url),
       suppressed, 
       3sec_views(view_count), 
       3sec_fires(count), 
       3sec_comments(*, profile:user_id(id, username, avatar_url))`,
      { count: "exact" }
    )
    .range(from, to); // Use range instead of limit and offset
  
  if (error) {
    throw new Error(error.message);
  }

  return data;
};



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
      "id, playback_id, created_at, country:country_id(id, name), profile:user_id(id, username, avatar_url, wallet_id), 3sec_tips(created_at, network, transaction_hash, amount, currency, comment, tipper:wallet_id(id, username, avatar_url)), 3sec_views(view_count), 3sec_fires(count), 3sec_comments(*, profile:user_id(id, username, avatar_url))",
      { count: "exact" },
    )
    .neq("suppressed", true)
    .limit(limit);

  return data;
};

/**
 * FETCH: fetchWithin48Hrs()
 * DB: supabase
 * TABLE: "3sec_desc_view"
 **/

export const fetchWithin48Hrs = async (limit: any) => {
  const supabase = createClient();

  // Get the current date and subtract 48 hours
  const now = new Date();
  const past48Hrs = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(); // Convert to ISO string for SQL query

  console.log("past48Hrs", past48Hrs);

  const { data, error } = await supabase
    .from("3sec_random_view")
    .select(
      "id, playback_id, created_at, country:country_id(id, name), profile:user_id(id, username, avatar_url, wallet_id), 3sec_tips(created_at, network, transaction_hash, amount, currency, comment, tipper:wallet_id(id, username, avatar_url)), 3sec_views(view_count), 3sec_fires(count), 3sec_comments(*, profile:user_id(id, username, avatar_url))",
      { count: "exact" },
    )
    .neq("suppressed", true) // Exclude suppressed posts
    .gte("created_at", past48Hrs) // Fetch posts created within the last 48 hours
    .limit(limit);

  if (error) {
    console.error("Error fetching posts from the last 48 hours:", error);
    return null;
  }

  return data;
};

/**
 * FETCH: fetchLatestTipped()
 * DB: supabase
 * TABLE: "3sec_desc_view"
 * Fetch those posts that have been tipped
 **/

export const fetchLatestTipped = async (limit: any) => {
  const supabase = createClient();

  // Get the current date and subtract 7 days (1 week)
  // const now = new Date();
  // const pastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(); // Convert to ISO string for SQL query

  const { data, error } = await supabase
    .from("3sec_random_view") // Ensure the table name is correct
    .select(
      "id, playback_id, created_at, country:country_id(id, name), profile:user_id(id, username, avatar_url, wallet_id), 3sec_tips(created_at, network, transaction_hash, amount, currency, comment, tipper:wallet_id(id, username, avatar_url)), 3sec_views(view_count), 3sec_fires(count), 3sec_comments(*, profile:user_id(id, username, avatar_url))",
      { count: "exact" },
    )
    .neq("suppressed", true) // Exclude suppressed posts
    .not("3sec_tips", "is", null) // Ensure tips are present
    //.gte("3sec_tips.created_at", pastWeek) // Filter tips created within the last 7 days
    .limit(limit);

  if (error) {
    console.error("Error fetching latest tipped posts:", error);
    return null;
  }

  return data;
};

/**
 * FETCH: fetchMostViewed()
 * DB: supabase
 * TABLE: "3sec_desc_view"
 * Fetch those posts that have views from 1k up
 **/
export const fetchMostViewed = async (limit: any) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("3sec_random_view") // Use the correct table name here
    .select(
      "id, playback_id, created_at, country:country_id(id, name), profile:user_id(id, username, avatar_url, wallet_id), 3sec_tips(created_at, network, transaction_hash, amount, currency, comment, tipper:wallet_id(id, username, avatar_url)), 3sec_views(view_count), 3sec_fires(count), 3sec_comments(*, profile:user_id(id, username, avatar_url))",
      { count: "exact" },
    )
    .neq("suppressed", true) // Exclude suppressed posts
    .gte("3sec_views.view_count", 1000) // Fetch posts with views >= 1,000
    .limit(limit);

  if (error) {
    console.error("Error fetching most viewed posts:", error);
    return null;
  }

  return data;
};

/**
 * FETCH: fetchVideoAndRandomFeed()
 * DB: supabase
 * TABLE: "3sec_desc_view"
 **/

export const fetchVideoAndRandomFeed = async (video_id: any, limit: any) => {
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
    .limit(limit - 1);

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
      "id, thumbnail_url, playback_id, created_at, country:country_id(name), profile:user_id(id, username, avatar_url, wallet_id), 3sec_views(view_count), 3sec_fires(count), 3sec_comments(*, profile:user_id(id, username, avatar_url))",
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
      "id, thumbnail_url, video_url, playback_id, created_at, country:country_id(name), profile:user_id(id, username, avatar_url, wallet_id), 3sec_views(view_count), 3sec_tips(created_at, network, transaction_hash, amount, currency, comment, tipper:wallet_id(id, username, avatar_url)), 3sec_fires(count), 3sec_comments(*, profile:user_id(id, username, avatar_url))",
    )
    .in("user_id", followingArray)
    .range(from, to);

  return { data };
};
