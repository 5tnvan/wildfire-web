"use client";

import { useEffect, useState } from "react";
import { fetchFollowed, fetchFollowers, fetchFollowing } from "~~/utils/wildfire/fetch/fetchFollows";
import { fetchLikes } from "~~/utils/wildfire/fetch/fetchVideoLikes";
import { fetchProfileByUsername } from "~~/utils/wildfire/fetch/fetchProfile";
import { fetchUser } from "~~/utils/wildfire/fetch/fetchUser";
import { fetchVideo } from "~~/utils/wildfire/fetch/fetchVideo";

/**
 * useFeed HOOK
 * Use this to a video, plus feed
 **/
export const useVideo = (video_id: any) => {
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState<any>();
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
    const data = await fetchVideo(video_id);
    if (data) {
      setVideo(data);
      const user = await fetchUser();
      const profile = await fetchProfileByUsername(data.profile.username);
      const followers = await fetchFollowers(profile.id);
      const following = await fetchFollowing(profile.id);
      const followed = await fetchFollowed(user.user?.id, profile.id);
      const likedByUser = await fetchLikes(user.user?.id, video_id);
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

  return { loading, video, posterProfile, followers, following, followed, likedByUser, refetch };
};
