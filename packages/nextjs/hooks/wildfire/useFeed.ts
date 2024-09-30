"use client";

import { useEffect, useState } from "react";

import { User } from "@supabase/supabase-js";

import {
  fetchLatestTipped,
  fetchMostViewed,
  fetchRandomFeed,
  fetchWithin48Hrs,
} from "@/utils/wildfire/fetch/fetchFeeds";
import { fetchLikes } from "@/utils/wildfire/fetch/fetchLikes";

/**
 * useFeed HOOK
 * Use this to get feed of videos
 **/
export const useFeed = (user: User | null, filter: "default" | "within48hrs" | "latestTipped" | "mostViewed") => {
  const range = 3;

  const [loading, setLoading] = useState(false);
  const [feeds, setFeeds] = useState<any[]>([]);
  const [nextFeeds, setNextFeeds] = useState<any[]>([]);
  //const [hasMore, setHasMore] = useState(true);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      (async () => {
        setLoading(true);

        try {
          let data;

          // Use switch for better readability
          switch (filter) {
            case "within48hrs":
              data = await fetchWithin48Hrs(2 * range);
              break;
            case "latestTipped":
              data = await fetchLatestTipped(2 * range);
              break;
            case "mostViewed":
              data = await fetchMostViewed(2 * range);
              break;
            default:
              data = await fetchRandomFeed(2 * range);
          }
          console.log("[data]", data);

          if (data) {
            // Check if each post is liked by the user
            const likedPostsPromises = data.map(async (post: any) => {
              return fetchLikes(post, user?.id);
            });

            // Wait for all promises to resolve
            const masterData = await Promise.all(likedPostsPromises);

            // Update the feed state with the new data
            setFeeds(masterData.slice(0, range));
            setNextFeeds(masterData.slice(range, range + range));
          }
        } catch (error) {
          console.error("Error fetching feed:", error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [triggerRefetch, user, filter]);

  const fetchMore = async () => {
    if (user && nextFeeds.length > 0 && !loading) {
      console.log("fetching more");

      setLoading(true);

      setFeeds(oldFeeds => [...oldFeeds, ...nextFeeds]);

      try {
        let data;

        // Use switch for better readability
        switch (filter) {
          case "within48hrs":
            data = await fetchWithin48Hrs(range);
            break;
          case "latestTipped":
            data = await fetchLatestTipped(range);
            break;
          case "mostViewed":
            data = await fetchMostViewed(range);
            break;
          default:
            data = await fetchRandomFeed(range);
        }
        console.log("[data]", data);

        if (data) {
          // Check if each post is liked by the user
          const likedPostsPromises = data.map(async (post: any) => {
            return fetchLikes(post, user.id);
          });

          const masterData = await Promise.all(likedPostsPromises); // Wait for all promises to resolve

          setNextFeeds(masterData);
        }
      } catch (error) {
        console.error("Error fetching feed:", error);
      } finally {
        setLoading(false);
      }
    } else setNextFeeds([]);
  };

  const refetch = () => setTriggerRefetch(prev => !prev);

  return { loading, feeds, fetchMore, refetch };
};
