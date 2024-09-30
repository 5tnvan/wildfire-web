"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import Image from "next/image";

import { XMarkIcon } from "@heroicons/react/24/solid";

import { AuthContext } from "@/app/context";
import VideoCard from "@/components/wildfire/VideoCard";
import { useFeed } from "@/hooks/wildfire/useFeed";

const Watch: NextPage = () => {
  const { user } = useContext(AuthContext);

  // Track filter state
  const [filter, setFilter] = useState<"default" | "within48hrs" | "latestTipped" | "mostViewed">("default");
  const [filterUI, setFilterUI] = useState(true);

  const { loading: loadingFeed, feeds, fetchMore, refetch } = useFeed(user, filter);

  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Toggle mute state
  const handleOnCtaMute = () => {
    setIsMuted(isMuted => !isMuted);
  };

  // Callback function for Intersection Observer
  const callback = (entries: any) => {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.getAttribute("data-index") || "0");
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

    const videoCards = sliderRef.current.querySelectorAll(".carousel-item");

    videoCards.forEach(card => {
      observer.observe(card);
    });
  }, [feeds]); // Ensure to run effect whenever feed changes

  return (
    <>
      {/* SHORTS FILTER */}
      {filterUI && (
        <div className="fixed hidden lg:flex flex-col w-64 h-fit bg-base-200 p-4 rounded-xl">
          <div className="self-end items-end mb-2 cursor-pointer" onClick={() => setFilterUI(false)}>
            <XMarkIcon width={20} />
          </div>

          {/* Button: Fresh off the boat */}
          <button
            className={`flex flex-row justify-between btn ${
              filter === "within48hrs"
                ? "bg-gradient-to-r from-cyan-600 via-lime-500 to-lime-500 border-0 text-black"
                : "dark:bg-zinc-800 bg-zinc-200"
            } w-full mb-1`}
            onClick={() => {
              setFilter("within48hrs");
              refetch();
            }}
          >
            <div className="flex flex-col w-6 h-6">
              <Image
                src="/yougotthis.png"
                width={300}
                height={300}
                alt="fresh"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <span>Fresh off the boat</span>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </button>

          {/* Button: Rising */}
          <button
            className={`flex flex-row justify-between btn ${
              filter === "latestTipped"
                ? "bg-gradient-to-r from-cyan-600 via-lime-500 to-lime-500 border-0 text-black"
                : "dark:bg-zinc-800 bg-zinc-200"
            } w-full mb-1`}
            onClick={() => {
              setFilter("latestTipped");
              refetch();
            }}
          >
            <div className="flex flex-col w-8 h-8">
              <Image src="/1f525.gif" width={300} height={300} alt="rising" style={{ width: "auto", height: "auto" }} />
            </div>
            <span>Rising</span>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </button>

          {/* Button: Cult Classic */}
          <button
            className={`flex flex-row justify-between btn ${
              filter === "mostViewed"
                ? "bg-gradient-to-r from-cyan-600 via-lime-500 to-lime-500 border-0 text-black"
                : "dark:bg-zinc-800 bg-zinc-200"
            } w-full mb-1`}
            onClick={() => {
              setFilter("mostViewed");
              refetch();
            }}
          >
            <div className="flex flex-col w-6 h-6">
              <Image
                src="/thanksdoc.png"
                width={300}
                height={300}
                alt="cult-classic"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <span>Cult Classic</span>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </button>
          <div
            className="font-base self-center mt-4 cursor-pointer text-xs"
            onClick={() => {
              setFilter("default");
              refetch();
            }}
          >
            Clear all
          </div>
        </div>
      )}

      {loadingFeed && feeds && feeds.length === 0 && (
        <div className="flex flex-row justify-center items-center w-full h-full">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      )}
      {/* FEED */}
      {feeds && feeds.length > 0 && (
        <div
          ref={sliderRef}
          className={`${
            filterUI ? "" : "flex flex-col items-center "
          }carousel carousel-vertical w-full h-full space-y-2 ml-[156px]`}
        >
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
};

export default Watch;
