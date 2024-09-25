"use client";

import { useEffect, useState } from "react";

import { User } from "@supabase/supabase-js";

import { getRange } from "@/utils/getRange";

import { fetchUserFeedWithRange } from "../../utils/wildfire/fetch/fetchFeeds";
import { fetchLikes } from "../../utils/wildfire/fetch/fetchLikes";

/**
 * useFeed HOOK
 * Use this to get feed of videos from authenticated user
 **/
export const useProfileFeeds = (user: User | null) => {
  const range = 3;

  const [loading, setLoading] = useState(false);
  const [feeds, setFeeds] = useState<any[]>([]);
  const [nextFeeds, setNextFeeds] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      setPage(0);

      (async () => {
        console.log("page", page);
        setLoading(true);

        const { from, to } = getRange(page, range);
        const data = await fetchUserFeedWithRange(user.id, from, to + range);
        console.log("[data]", data);

        if (data) {
          // Check if each post is liked by the user
          const likedPostsPromises = data.map(async (post: any) => {
            return fetchLikes(post, user.id);
          });

          const masterData = await Promise.all(likedPostsPromises); // Wait for all promises to resolve

          setFeeds(masterData.slice(0, range));
          setNextFeeds(masterData.slice(range, range + range));

          setPage(1);
        }

        setLoading(false);
      })();
    }
  }, [triggerRefetch, user]);

  const fetchMore = async () => {
    if (user && nextFeeds.length > 0 && !loading) {
      console.log("fetching more");

      console.log("page", page);
      setLoading(true);

      setFeeds(oldFeeds => [...oldFeeds, ...nextFeeds]);

      const { from, to } = getRange(page + 1, range);
      const data = await fetchUserFeedWithRange(user.id, from, to);
      console.log("[data]", data);

      if (data) {
        // Check if each post is liked by the user
        const likedPostsPromises = data.map(async (post: any) => {
          return fetchLikes(post, user.id);
        });

        const masterData = await Promise.all(likedPostsPromises); // Wait for all promises to resolve

        setNextFeeds(masterData);

        setPage(prevPage => prevPage + 1);
      }

      setLoading(false);
    } else setNextFeeds([]);
  };

  const refetch = () => setTriggerRefetch(prev => !prev);

  return { loading, feeds, fetchMore, refetch };
};
