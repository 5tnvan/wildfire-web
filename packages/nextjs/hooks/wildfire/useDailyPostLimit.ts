"use client";

import { useEffect, useState } from "react";
import { fetchLastVideoPosts, fetchLevel } from "~~/utils/wildfire/fetch/fetch3Sec";
import { fetchUser } from "~~/utils/wildfire/fetch/fetchUser";

/**
 * useFeed HOOK
 * Use this to check daily posting limit
 **/
export const useDailyPostLimit = () => {
  // State variables to manage loading state, post limit, remaining posts, and fetched posts
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState<boolean | null>(null);
  const [postLeft, setPostLeft] = useState<number | null>(null);
  const [posts, setPosts] = useState<any>([]);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  // Function to toggle triggerRefetch, causing a refetch of data
  const refetch = () => {
    setTriggerRefetch(prev => !prev);
  };

  // Function to initialize and fetch data
  const init = async () => {
    setIsLoading(true); // Start loading

    const now = new Date(); // Get current date and time
    const user = await fetchUser(); // Fetch user data

    // Fetch the user's last video posts
    const posts = await fetchLastVideoPosts(user.user?.id);
    setPosts(posts); // Store fetched posts in state

    const levelData = await fetchLevel(user.user?.id); // Fetch user level data

    // Determine the allowed number of posts based on user classification
    const maxPosts = levelData ? 6 : 3; // 'Creator' allows 6 posts, 'Noob' allows 3 posts

    // Filter posts made within the last 24 hours, default to empty array if posts is undefined
    const postsInLast24Hours = (posts || []).filter(post => {
      const postDate = new Date(post.created_at);
      const diff = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60); // Difference in hours
      return diff < 24;
    });

    // Calculate the number of posts left
    const postsLeft = Math.max(0, maxPosts - postsInLast24Hours.length);
    setPostLeft(postsLeft);

    // Determine if the user has reached their limit
    setLimit(postsLeft === 0);

    setIsLoading(false); // Stop loading
  };

  // useEffect to initialize data fetching when component mounts or triggerRefetch changes
  useEffect(() => {
    init();
  }, [triggerRefetch]);

  // Return the loading state, post limit, posts, remaining posts, and refetch function
  return { isLoading, limit, posts, postLeft, refetch };
};
