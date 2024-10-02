"use client";

import { useEffect, useState } from "react";

import { User } from "@supabase/supabase-js";

import { fetchRandomFeed, fetchVideoAndRandomFeed } from "@/utils/wildfire/fetch/fetchFeeds";
import { fetchLikes } from "@/utils/wildfire/fetch/fetchLikes";

/**
 * useFeed HOOK
 * Use this to a video, plus feed
 **/
export const useVideo = (user: User | null, video_id: any) => {
  const range = 3;

  const [loading, setLoading] = useState(false);
  const [feed, setFeed] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setPage(0); // Reset page
    setFeed([]); // Reset feed
    setTriggerRefetch(prev => !prev); // Trigger refetch
  };

  const fetchMore = () => {
    console.log("fetching more");
    setPage(prevPage => prevPage + 1); // Increase page by 1 to trigger fetchFeed
  };

  useEffect(() => {
    (async () => {
      setLoading(true);

      // Get auth user and feed
      let data: any[] | null = null;
      if (page == 0) {
        data = await fetchVideoAndRandomFeed(video_id, range);
      } else if (page > 0) {
        data = await fetchRandomFeed(range);
      }
      if (data) {
        // Check if each post is liked by the user
        const likedPostsPromises = data.map(async (post: any) => {
          return fetchLikes(post, user?.id);
        });

        // Wait for all promises to resolve
        const masterData = await Promise.all(likedPostsPromises);

        //setFeed
        setFeed(existingFeed => [...existingFeed, ...masterData]);
      }
      setLoading(false);
    })();
  }, [page, triggerRefetch, user, video_id]);

  return { loading, feed, fetchMore, refetch };
};
