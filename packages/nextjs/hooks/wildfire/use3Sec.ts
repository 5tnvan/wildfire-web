"use client";

import { useEffect, useState } from "react";
import { fetch3Sec } from "~~/utils/wildfire/fetch/fetch3Sec";

/**
 * USEPROFILE HOOK
 * Use this to get currently authenticated user's profile
 **/
export const use3Sec = (video_id: any) => {
  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch(prev => !prev);
  };

  const init = async () => {
    setLoading(true);
    console.log("use3Sec", video_id);
    const res = await fetch3Sec(video_id);
    if (res) setVideo(res);
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { loading, video, refetch };
};
