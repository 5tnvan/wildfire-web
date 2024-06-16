"use client";

import { useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import VideoCard2 from "~~/components/wildfire/VideoCard2";
import { useFeed } from "~~/hooks/wildfire/useFeed";

const Watch: NextPage = () => {
  const { feed, fetchMore } = useFeed();
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

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
    if (!carouselRef.current) return;

    const options = {
      root: carouselRef.current,
      rootMargin: "0px",
      threshold: 0.8, // Multiple thresholds for more accurate detection
    };

    const observer = new IntersectionObserver(callback, options);

    const videoCards = carouselRef.current.querySelectorAll(".carousel-item");

    videoCards.forEach(card => {
      observer.observe(card);
    });
  }, [feed]); // Ensure to run effect whenever feed changes

  return (
    <div ref={carouselRef} className=" carousel carousel-center max-w-lg space-x-2 rounded-lg grow">
      {feed && feed.length > 0 ? (
        <>
          {feed.map((video, index) => (
            <VideoCard2
              key={index}
              index={index}
              author={video.profile.username}
              videoURL={video.video_url}
              lastVideoIndex={feed.length - 1}
              getVideos={fetchMore}
              isPlaying={index === playingIndex}
            />
          ))}
        </>
      ) : (
        <>Loading...</>
      )}
    </div>
  );
};

export default Watch;
