"use client";

import { useEffect, useState } from "react";
import { fetchUserFeedWithRange } from "../../utils/wildfire/fetch/fetchFeeds";
import { fetchLikes } from "../../utils/wildfire/fetch/fetchLikes";
import { fetchUser } from "../../utils/wildfire/fetch/fetchUser";

const getRange = (page: number, range: number) => {
  const from = page * range;
  const to = from + range - 1;
  return { from, to };
};

/**
 * useFeed HOOK
 * Use this to get feed of videos
 **/
export const useUserFeed = (user_id: any) => {
  const range = 3;

  const [isLoading, setIsLoading] = useState(false);
  const [feed, setFeed] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setPage(0); // Reset page
    setFeed([]); // Reset feed
    setHasMore(true); // Reset hasMore to true
    setTriggerRefetch(prev => !prev); // Trigger refetch
  };

  const fetchMore = () => {
    console.log("fetching more");
    if (hasMore) {
      setPage(prevPage => prevPage + 1); // Increase page by 1
    }
  };

  const fetchFeed = async () => {
    setIsLoading(true);
    const { from, to } = getRange(page, range);
    const user = await fetchUser();
    const data = await fetchUserFeedWithRange(user_id, from, to);

    if (data) {
      // Check if each post is liked by the user
      const likedPostsPromises = data.map(async (post: any) => {
        return fetchLikes(post, user.user?.id);
      });

      // Wait for all promises to resolve
      const masterData = await Promise.all(likedPostsPromises);

      if (data.length < range) {
        setHasMore(false); // No more data to fetch
      }

      setFeed(existingFeed => [...existingFeed, ...masterData]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, [page, triggerRefetch]);

  return { isLoading, feed, fetchMore, refetch };
};
