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
  const [feeds, setFeeds] = useState<any[]>([]);
  const [nextFeeds, setNextFeeds] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  useEffect(() => {
    if (username && !loading) {
      setPage(0);

      (async () => {
        console.log("page", page);
        setLoading(true);

        const profile = await fetchProfileByUsername(username);

        if (profile) {
          const { from, to } = getRange(page, range);
          const data = await fetchUserFeedWithRange(profile.id, from, to + range);

          if (data) {
            // Check if each post is liked by the user
            const likedPostsPromises = data.map(async (post: any) => {
              return fetchLikes(post, profile.id);
            });

            const masterData = await Promise.all(likedPostsPromises); // Wait for all promises to resolve

            setFeeds(masterData.slice(0, range));
            setNextFeeds(masterData.slice(range, range + range));

            setPage(1);
          }
        }

        setLoading(false);
      })();
    }
  }, [triggerRefetch, username]);

  const fetchMore = async () => {
    if (username && nextFeeds.length > 0 && !loading) {
      console.log("fetching more");

      console.log("page", page);
      setLoading(true);

      setFeeds(oldFeeds => [...oldFeeds, ...nextFeeds]);

      const profile = await fetchProfileByUsername(username);

      if (profile) {
        const { from, to } = getRange(page + 1, range);
        const data = await fetchUserFeedWithRange(profile.id, from, to);

        if (data) {
          // Check if each post is liked by the user
          const likedPostsPromises = data.map(async (post: any) => {
            return fetchLikes(post, profile.id);
          });

          const masterData = await Promise.all(likedPostsPromises); // Wait for all promises to resolve

          setNextFeeds(masterData);

          setPage(prevPage => prevPage + 1);
        }
      }

      setLoading(false);
    } else setNextFeeds([]);
  };

  const refetch = () => setTriggerRefetch(prev => !prev);

  return { loading, feeds, fetchMore, refetch };
};
