"use client";

import { useEffect, useState } from "react";

import { getRange } from "@/utils/getRange";
import { fetchProfileByUsername } from "@/utils/wildfire/fetch/fetchProfile";

import { fetchUserFeedWithRange } from "../../utils/wildfire/fetch/fetchFeeds";
import { fetchLikes } from "../../utils/wildfire/fetch/fetchLikes";

/**
 * useFeed HOOK
 * Use this to get feed of videos
 **/
export const useUserFeedByUsername = (username: any) => {
  const range = 3;

  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    const { from, to } = getRange(page, range);
    const profile = await fetchProfileByUsername(username);
    if (profile) {
      const data = await fetchUserFeedWithRange(profile.id, from, to);

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

  return { loading, feed, fetchMore, refetch };
};