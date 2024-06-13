"use client";

import { useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import VideoCard from "~~/components/wildfire/VideoCard";
import { useFeed } from "~~/hooks/wildfire/useFeed";

const Watch: NextPage = () => {
  const { feed, fetchMore } = useFeed();
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  console.log(feed);

  // Callback function for Intersection Observer
  const callback = (entries: any) => {
    entries.forEach((entry: any) => {
      console.log(entry.target, entry.isIntersecting);
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
      threshold: 0.8, // Multiple thresholds for more accurate detection
    };

    const observer = new IntersectionObserver(callback, options);

    const videoCards = sliderRef.current.querySelectorAll(".slider-children");

    videoCards.forEach(card => {
      observer.observe(card);
    });
  }, [feed]); // Ensure to run effect whenever feed changes

  return (
    <div ref={sliderRef} className="slider-container">
      {feed && feed.length > 0 ? (
        <>
          {feed.map((video, index) => (
            <VideoCard
              key={index}
              index={index}
              data={video}
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
