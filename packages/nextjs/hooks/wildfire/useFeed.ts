"use client";

import { useEffect, useState } from "react";

import { User } from "@supabase/supabase-js";

import { fetchRandomFeed } from "@/utils/wildfire/fetch/fetchFeeds";
import { fetchLikes } from "@/utils/wildfire/fetch/fetchLikes";

/**
 * useFeed HOOK
 * Use this to get feed of videos
 **/
export const useFeed = (user: User | null) => {
  const range = 3;

  const [loading, setLoading] = useState(false);
  const [feed, setFeed] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  //const [hasMore, setHasMore] = useState(true);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setPage(0); // Reset page
    setFeed([]); // Reset feed
    //setHasMore(true); // Reset hasMore to true
    setTriggerRefetch(prev => !prev); // Trigger refetch
  };

  const fetchMore = () => {
    setPage(prevPage => prevPage + 1); // Increase page by 1 to triggter fetchFeed
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchRandomFeed(range);

      if (data) {
        // Check if each post is liked by the user
        const likedPostsPromises = data.map(async (post: any) => {
          return fetchLikes(post, user?.id);
        });

        // Wait for all promises to resolve
        const masterData = await Promise.all(likedPostsPromises);

        setFeed(existingFeed => [...existingFeed, ...masterData]);
      }
      setLoading(false);
    })();
  }, [page, triggerRefetch, user]);

  return { loading, feed, fetchMore, refetch };
};
