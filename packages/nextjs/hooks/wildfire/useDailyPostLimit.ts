import { useEffect, useState } from "react";

import { User } from "@supabase/supabase-js";

import { fetchLastVideoPosts, fetchLevel } from "@/utils/wildfire/fetch/fetch3Sec";

/**
 * useDailyPostLimit HOOK
 * Use this to check daily posting limit
 **/
export const useDailyPostLimit = (user: User | null) => {
  // State variables to manage loading state, post limit, remaining posts, and fetched posts
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState<boolean | null>(null);
  const [postLeft, setPostLeft] = useState<number | null>(null);
  const [posts, setPosts] = useState<any>([]);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const now = new Date();

      // Fetch last video posts
      const posts = await fetchLastVideoPosts(user?.id);
      setPosts(posts);
      const levelData = await fetchLevel(user?.id);

      fetchLevel(user?.id).then(levelData => {
        console.log(levelData);
      
        // Determine the allowed number of posts based on user classification
        const maxPosts = levelData?.level === 1 ? 6 : 3; // 'Creator' (level 1) allows 6 posts, 'Noob' allows 3 posts
      
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
    
        // // FIXME: This is for temporary uses
        // setLimit(false);
        // setPostLeft(999999);
      });
      

      setIsLoading(false);
    })();
  }, [triggerRefetch, user]);

  // Function to toggle triggerRefetch, causing a refetch of data
  const refetch = () => setTriggerRefetch(prev => !prev);

  // Return the loading state, post limit, posts, remaining posts, and refetch function
  return { isLoading, limit, posts, postLeft, refetch };
};
