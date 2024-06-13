"use client";

import { useEffect, useState } from "react";
import { fetchUserFeedFromArrayOfFollowing } from "../../utils/wildfire/fetch/fetchFeeds";
import { fetchUser } from "../../utils/wildfire/fetch/fetchUser";
import { fetchFollowing } from "~~/utils/wildfire/fetch/fetchFollows";
import { fetchLikes } from "~~/utils/wildfire/fetch/fetchLikes";

const getRange = (page: number, range: number) => {
  const from = page * range;
  const to = from + range - 1;
  return { from, to };
};

/**
 * useFeed HOOK
 * Use this to get feed of videos
 **/
export const useUserFollowedFeed = () => {
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

    // Get list of auth's user following
    const user = await fetchUser();
    const following = await fetchFollowing(user.user?.id);

    if (following) {
      const followingArray = following.map((f: any) => f.following.id); // Create an array of IDs from following

      const { data } = await fetchUserFeedFromArrayOfFollowing(followingArray, from, to);

      if (data) {
        const likedPostsPromises = data.map(async (post: any) => {
          const { liked } = await fetchLikes(post, user.user?.id);
          return { ...post, liked: !!liked }; // Add a property 'liked' to each post indicating whether it's liked by the user
        });

        // Wait for all promises to resolve
        const masterData = await Promise.all(likedPostsPromises);

        if (data.length < range) {
          setHasMore(false); // No more data to fetch
        }

        setFeed(existingFeed => [...existingFeed, ...masterData]);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, [page, triggerRefetch]);

  return { isLoading, feed, fetchMore, refetch };
};
