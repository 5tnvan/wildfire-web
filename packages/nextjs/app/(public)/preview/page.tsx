"use client";

import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NextPage } from "next";
import { AuthContext } from "~~/app/context";
import VideoCardPreview from "~~/components/wildfire/VideoCardPreview";
import { useFeed } from "~~/hooks/wildfire/useFeed";
import VideoCard from "~~/components/wildfire/VideoCard";

const Preview: NextPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { loading: loadingFeed, feed, fetchMore } = useFeed();
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true); // New state for mute toggle
  const sliderRef = useRef<HTMLDivElement>(null);

  console.log(feed);

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
        {loadingFeed && feed && feed.length == 0 && (
          <div className="flex flex-row justify-center items-center w-full h-screen-custom">
            <span className="loading loading-ring loading-lg"></span>
          </div>
        )}
        {feed && feed.length > 0 && (
          <div ref={sliderRef} className="infinite-scroll">
            {feed.map((video, index) => (
              <VideoCard
                key={index}
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
  }
};

export default Preview;
