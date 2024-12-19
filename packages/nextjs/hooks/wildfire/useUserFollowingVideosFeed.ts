"use client";

import { useEffect, useState } from "react";
import { fetchUser } from "../../utils/wildfire/fetch/fetchUser";
import { fetchFollowing } from "~~/utils/wildfire/fetch/fetchFollows";
import { fetchLikes } from "~~/utils/wildfire/fetch/fetchLikes";
import { fetchUserFeedFromArrayOfFollowing } from "~~/utils/wildfire/fetch/fetchVideoFeeds";

const getRange = (page: number, range: number) => {
  const from = page * range;
  const to = from + range - 1;
  return { from, to };
};

/**
 * useFeed HOOK
 * Use this to get feed of videos
 **/
export const useUserFollowingVideosFeed = (range: any) => {

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

    // Get list of auth's user following
    const user = await fetchUser();
    const following = await fetchFollowing(user.user?.id);

    if (following) {
      const followingArray = following.map((f: any) => f.following.id); // Create an array of IDs from following

      const { data } = await fetchUserFeedFromArrayOfFollowing(followingArray, from, to);

      if (data) {

        if (data.length < range) {
          setHasMore(false); // No more data to fetch
        }

        setFeed(existingFeed => [...existingFeed, ...data]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, [page, triggerRefetch]);

  return { loading, feed, fetchMore, refetch };
};
