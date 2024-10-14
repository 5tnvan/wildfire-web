import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { fetchAll } from "~~/utils/wildfire/fetch/fetchFeeds";
import { fetchLikes } from "~~/utils/wildfire/fetch/fetchLikes";

/**
 * useAdmin HOOK
 * Use this to get feed of videos
 **/
export const useAdmin = (user: User | null) => {
  const range = 5; // Number of videos to fetch per page
  const [page, setPage] = useState(0); // Track current page
  const [loading, setLoading] = useState(false);
  const [feeds, setFeeds] = useState<any[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false); // Tracks if there is a next page

  // Fetch the initial feed and subsequent feeds on page change
  useEffect(() => {
    if (!loading) {
      (async () => {
        setLoading(true);
        try {
          const data = await fetchAll(range, page * range); // Adjusted to fetch based on page * range
          if (data) {
            // Check if each post is liked by the user
            const likedPostsPromises = data.map(async (post: any) => fetchLikes(post, user?.id));

            // Wait for all promises to resolve
            const masterData = await Promise.all(likedPostsPromises);

            // Append new data to the existing feed (do not overwrite)
            setFeeds(existingFeed => [...existingFeed, ...masterData]);

            // If the data length equals the range, there is a next page
            setHasNextPage(data.length === range);
          }
        } catch (error) {
          console.error("Error fetching feed:", error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [user, page]); // Fetch data when user or page changes

  // Fetch more feeds (next page)
  const fetchMore = async () => {
    if (loading || !hasNextPage) return; // Prevent fetching if already loading or no next page
    setPage(prevPage => prevPage + 1); // Increment the page to fetch next set of items
  };

  const refetch = () => {
    setFeeds([]); // Clear feeds
    setPage(0); // Reset page to 0 and refetch
  };

  return { loading, feeds, fetchMore, refetch, hasNextPage };
};
