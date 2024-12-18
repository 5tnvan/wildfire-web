"use client";

import { useEffect, useState } from "react";
import { fetchRandomFeed, fetchVideoAndRandomFeed } from "~~/utils/wildfire/fetch/fetchShortsFeeds";
import { fetchLikes } from "~~/utils/wildfire/fetch/fetchLikes";
import { fetchUser } from "~~/utils/wildfire/fetch/fetchUser";

/**
 * useFeed HOOK
 * Use this to a video, plus feed
 **/
export const useShorts = (video_id: any) => {
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

  const fetchFeed = async () => {
    setLoading(true);

    // Get auth user and feed
    const user = await fetchUser();
    let data: any[] | null = null;
    if (page == 0) {
      data = await fetchVideoAndRandomFeed(video_id, range);
    } else if (page > 0) {
      data = await fetchRandomFeed(range);
    }
    if (data) {
      // Check if each post is liked by the user
      const likedPostsPromises = data.map(async (post: any) => {
        return fetchLikes(post, user.user?.id);
      });

      // Wait for all promises to resolve
      const masterData = await Promise.all(likedPostsPromises);

      //setFeed
      setFeed(existingFeed => [...existingFeed, ...masterData]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, [page, triggerRefetch]);

  return { loading, feed, fetchMore, refetch };
};
