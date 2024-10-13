"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import { useParams } from "next/navigation";

import { AuthContext } from "@/app/context";
import VideoCard from "@/components/wildfire/VideoCard";
import { useVideo } from "@/hooks/wildfire/useVideo";

const Video: NextPage = () => {
  const { user } = useContext(AuthContext);

  const { video_id } = useParams();
  const { loading: loadingFeed, feed, fetchMore } = useVideo(user, video_id);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Toggle mute state
  const handleOnCtaMute = (mute: any) => {
    setIsMuted(mute);
  };

  // Callback function for Intersection Observer
  const callback = (entries: any) => {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.getAttribute("data-index") || "0", 10);
        setPlayingIndex(index);
      }
    });
  };

  useEffect(() => {
    if (!sliderRef.current) return;

    const options = {
      root: sliderRef.current,
      rootMargin: "0px",
      threshold: 0.3, // Multiple thresholds for more accurate detection
    };

    const observer = new IntersectionObserver(callback, options);

    const videoCards = sliderRef.current.querySelectorAll(".infinite-scroll-item");

    videoCards.forEach(card => {
      observer.observe(card);
    });
  }, [feed]); // Ensure to run effect whenever feed changes

  return (
    <>
      {loadingFeed && feed && feed.length == 0 && (
        <div className="flex flex-row justify-center items-center w-full h-screen-custom">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      )}
      {feed && feed.length > 0 && (
        <div ref={sliderRef} className="infinite-scroll">
          {feed.map((video, index) => (
            <VideoCard
              key={video.id + index}
              index={index}
              data={video}
              feedLength={feed.length}
              getVideos={fetchMore}
              isPlaying={index === playingIndex}
              isMuted={isMuted}
              onCtaMute={handleOnCtaMute}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Video;
