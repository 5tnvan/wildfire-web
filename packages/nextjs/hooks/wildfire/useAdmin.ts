import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { fetchAll } from "@/utils/wildfire/fetch/fetchFeeds";

/**
 * useAdmin HOOK
 * Use this to get feed of videos
 **/
export const useAdmin = (user: User | null) => {
  const range = 10;  // Number of videos to fetch per page
  const [page, setPage] = useState(0);  // Track current page
  const [loading, setLoading] = useState(false);
  const [feeds, setFeeds] = useState<any[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);  // Tracks if there is a next page
  const [hasPrevPage, setHasPrevPage] = useState(false);  // Tracks if there is a previous page

  useEffect(() => {
    if (!loading) {
      (async () => {
        setLoading(true);

        try {
          // Fetch current page of feeds
          const data = await fetchAll(range, page);
          console.log("[data]", data);

          if (data) {
            setFeeds(data); // Store fetched feeds in state
            setHasNextPage(data.length === range);  // Check if there's more data for the next page
            setHasPrevPage(page > 0);  // Check if there's a previous page
          }
        } catch (error) {
          console.error("Error fetching feed:", error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [user, page]);  // Run when user or page changes

  const fetchMore = async (direction: 'next' | 'prev') => {
    if (loading) return;  // Prevent fetching if already loading

    let newPage = page;
    if (direction === 'next') newPage = page + 1;
    if (direction === 'prev' && page > 0) newPage = page - 1;

    setLoading(true);
    try {
      const data = await fetchAll(range, newPage);

      if (data) {
        setFeeds(data);  // Replace current data with new page data
        setPage(newPage);  // Update page number
        setHasNextPage(data.length === range);  // Check if more data exists for the next page
        setHasPrevPage(newPage > 0);  // Check if there's a previous page
      }
    } catch (error) {
      console.error("Error fetching more feed:", error);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => setPage(0);  // Reset page to 0 and refetch

  return { loading, feeds, fetchMore, refetch, hasNextPage, hasPrevPage };
};
