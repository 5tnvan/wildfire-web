"use client";

import { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NextPage } from "next";
import { AuthUserFollowsContext } from "~~/app/context";
import VideoCard from "~~/components/wildfire/VideoCard";
import { useUserFollowedFeed } from "~~/hooks/wildfire/useUserFollowingFeed";

const Feed: NextPage = () => {
  //CONSUME PROVIDERS
  const { following } = useContext(AuthUserFollowsContext);

  //FETCH DIRECTLY
  const { feed: userFeed, fetchMore } = useUserFollowedFeed();

  //STATES
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

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
      threshold: 0.8, // Multiple thresholds for more accurate detection
    };

    const observer = new IntersectionObserver(callback, options);

    const videoCards = sliderRef.current.querySelectorAll(".infinite-scroll-item");

    videoCards.forEach((card: any) => {
      observer.observe(card);
    });
  }, [userFeed]); // Ensure to run effect whenever feed changes
  return (
    <>
      <div id="feed-page" className="flex flex-row bg-lime-400">
        {/* FOLLOWING */}
        <div
          id="feed-page-following"
          className="stats h-full max-h-screen overflow-scroll flex flex-col bg-base-200 shadow py-5 mr-2"
        >
          {following?.map((following: any) => (
            <>
              <Link href={"/" + following.following.username} className="stat hover:opacity-75">
                <div className="stat-figure text-secondary">
                  {following.following.avatar_url && (
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <Image src={following.following.avatar_url} alt="avatar" width={20} height={20} />
                      </div>
                    </div>
                  )}
                  {!following.following.avatar_url && (
                    <div className="avatar placeholder">
                      <div className="bg-base-100 text-primary-content rounded-full w-12">
                        <span className="text-3xl">{following.following.username.charAt(0).toUpperCase()}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="stat-title">Level</div>
                <div className="stat-value text-lg">{following.following.username}</div>
              </Link>
            </>
          ))}
        </div>
        {/* FEED */}
        <div id="feed-page-infinitite-scroll" ref={sliderRef} className="infinite-scroll bg-red-300">
          {userFeed && userFeed.length > 0 ? (
            <>
              {userFeed.map((video: any, index: any) => (
                <VideoCard
                  key={index}
                  index={index}
                  data={video}
                  lastVideoIndex={userFeed.length - 1}
                  getVideos={fetchMore}
                  isPlaying={index === playingIndex}
                />
              ))}
            </>
          ) : (
            <>Loading...</>
          )}
        </div>
      </div>
    </>
  );
};

export default Feed;
