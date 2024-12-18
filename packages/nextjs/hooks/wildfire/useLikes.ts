"use client";

import { useEffect, useState } from "react";
import { fetchAllApproved } from "../../utils/wildfire/fetch/fetchShortsFeeds";
import { fetchLikes } from "../../utils/wildfire/fetch/fetchLikes";
import { fetchUser } from "~~/utils/wildfire/fetch/fetchUser";

const getRange = (page: number, range: number) => {
  const from = page * range;
  const to = from + range - 1;
  return { from, to };
};

/**
 * useAdmin HOOK
 * Use this to get feed of videos for the admin panel
 **/
export const useLikes = () => {
  const range = 5; // Number of videos per page
  const [loading, setLoading] = useState(false);
  const [feeds, setFeeds] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setPage(0); // Reset page
    setFeeds([]); // Reset feed
    setHasMore(true); // Reset hasMore to true
    setTriggerRefetch(prev => !prev); // Trigger refetch
  };

  const fetchMore = () => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1); // Increase page by 1
    }
  };

  const fetchFeed = async () => {
    setLoading(true);
    const { from, to } = getRange(page, range);
    const user = await fetchUser(); // Fetch user to get their ID
    if (user.user) {
      const data = await fetchAllApproved(from, to);

      if (data) {
        // Check if each post is liked by the user
        const likedPostsPromises = data.map(async (post: any) => {
          return fetchLikes(post, user.user.id);
        });

        const masterData = await Promise.all(likedPostsPromises);
        if (data.length < range) setHasMore(false);
        setFeeds(existingFeeds => [...existingFeeds, ...masterData]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, [page, triggerRefetch]);

  return { loading, feeds, fetchMore, refetch, hasMore };
};
