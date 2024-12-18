"use client";

import { useEffect, useState } from "react";
import { fetchLikes } from "~~/utils/wildfire/fetch/fetchLikes";
import { fetchProfileByUsername } from "~~/utils/wildfire/fetch/fetchProfile";
import { fetchUserVideoFeedAll, fetchUserVideoFeedWithRange } from "~~/utils/wildfire/fetch/fetchVideoFeeds";

const getRange = (page: number, range: number) => {
  const from = page * range;
  const to = from + range - 1;
  return { from, to };
};

/**
 * useFeed HOOK
 * Use this to get feed of videos
 **/
export const useUserVideoFeedByUsername = (username: any, range: number) => {
  const [loading, setLoading] = useState(false);
  const [feed, setFeed] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
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
    setLoading(true);
    const { from, to } = getRange(page, range);

    const profile = await fetchProfileByUsername(username);

    if (profile) {
      const count = await fetchUserVideoFeedAll(profile.id);
      const data = await fetchUserVideoFeedWithRange(profile.id, from, to);

      if (count) {
        setCount(count.length);
      }

      if (data) {
        // Check if each post is liked by the user
        const likedPostsPromises = data.map(async (post: any) => {
          return fetchLikes(post, profile.id);
        });

        const masterData = await Promise.all(likedPostsPromises); // Wait for all promises to resolve
        if (data.length < range) setHasMore(false); // No more data to fetch
        setFeed(existingFeed => [...existingFeed, ...masterData]);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [page, triggerRefetch]);

  return { loading, feed, count, fetchMore, refetch };
};
