"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import Link from "next/link";

import { AuthContext } from "@/app/context";
import VideoCard from "@/components/wildfire/VideoCard";
import { useFeed } from "@/hooks/wildfire/useFeed";

const Preview: NextPage = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { loading: loadingFeed, feeds, fetchMore } = useFeed(user, "default");
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true); // New state for mute toggle
  const sliderRef = useRef<HTMLDivElement>(null);

  console.log(feeds);

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
  }, [feeds]); // Ensure to run effect whenever feed changes

  // Toggle mute state
  const handleOnCtaMute = (mute: any) => {
    setIsMuted(mute);
  };

  if (isAuthenticated) {
    return (
      <>
        <div className="flex grow justify-center items-center">
          <Link className="btn btn-primary" href="/watch">
            Go to the App
          </Link>
        </div>
      </>
    );
  } else {
    return (
      <>
        {loadingFeed && feeds && feeds.length == 0 && (
          <div className="flex flex-row justify-center items-center w-full h-screen-custom">
            <span className="loading loading-ring loading-lg"></span>
          </div>
        )}
        {feeds && feeds.length > 0 && (
          <div ref={sliderRef} className="infinite-scroll flex flex-col items-center">
            {feeds.map((feed, index) => (
              <VideoCard
                key={index}
                index={index}
                data={feed}
                feedLength={feeds.length}
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
  }
};

export default Preview;
