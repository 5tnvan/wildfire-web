"use client";

import { useEffect, useState } from "react";
import { fetchFollowed, fetchFollowers, fetchFollowing } from "~~/utils/wildfire/fetch/fetchFollows";
import { fetchIdea } from "~~/utils/wildfire/fetch/fetchIdea";
import { fetchLikes } from "~~/utils/wildfire/fetch/fetchIdeaLikes";
import { fetchProfileByUsername } from "~~/utils/wildfire/fetch/fetchProfile";
import { fetchUser } from "~~/utils/wildfire/fetch/fetchUser";

/**
 * useFeed HOOK
 * Use this to a video, plus feed
 **/
export const useIdea = (idea_id: any) => {
  const [loading, setLoading] = useState(false);
  const [idea, setIdea] = useState<any>();
  const [likedByUser, setlikedByUser] = useState<any>();
  const [posterProfile, setPosterProfile] = useState<any>();
  const [followers, setFollowers] = useState<any>();
  const [following, setFollowing] = useState<any>();
  const [followed, setFollowed] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch(prev => !prev); // Trigger refetch
  };

  const fetchFeed = async () => {
    setLoading(true);

    // Get auth user and feed
    const data = await fetchIdea(idea_id);
    if (data) {
      setIdea(data);
      const user = await fetchUser();
      const profile = await fetchProfileByUsername(data.profile.username);
      const followers = await fetchFollowers(profile.id);
      const following = await fetchFollowing(profile.id);
      const followed = await fetchFollowed(user.user?.id, profile.id);
      const likedByUser = await fetchLikes(user.user?.id, idea_id);
      setPosterProfile(profile);
      setFollowers(followers);
      setFollowing(following);
      setFollowed(followed);
      setlikedByUser(likedByUser);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, [triggerRefetch]);

  return { loading, idea, posterProfile, followers, following, followed, likedByUser, refetch };
};
