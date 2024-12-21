"use client";

import { useState } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { NextPage } from "next";
import { ArrowDownCircleIcon, EyeIcon } from "@heroicons/react/24/solid";
import { TimeAgo } from "~~/components/wildfire/TimeAgo";
import { useIdeasFeed } from "~~/hooks/wildfire/useIdeaFeeds";
import { Avatar } from "~~/components/Avatar";
import { useRouter } from "next/navigation";
import FormatNumber from "~~/components/wildfire/FormatNumber";

const Sparks: NextPage = () => {
  const router = useRouter();
  const [filter, setFilter] = useState("latest");

  // FETCH DIRECTLY
  const { loading: loadingFeed, feed, fetchMore, refetch } = useIdeasFeed(filter, 6, 9);

  // Helper function to format text with hashtags and mentions
  const formatText = (text: string) => {
    return text.split("\n").map((line, i) => (
      <div key={`line-${i}`}>
        {line
          .split(/(#\w+|@\w+)/g) // Split text into parts with hashtags/mentions
          .map((part, index) => {
            if (part.startsWith("#")) {
              return (
                <div key={`hash-${i}-${index}`} className="text-primary">
                  {part}
                </div>
              );
            } else if (part.startsWith("@")) {
              return (
                <div key={`mention-${i}-${index}`} className="text-primary" onClick={() => router.push(`/${part.substring(1)}`)}>
                  {part}
                </div>
              );
            } else {
              // Wrap plain text in a span with a key
              return (
                <span key={`text-${i}-${index}`}>{part}</span>
              );
            }
          })}
        <br key={`br-${i}`} />
      </div>
    ));
  };

  return (
    <>
      <div className="mx-2 h-screen-custom overflow-scroll">
        {/* FILTER */}
        <div className="flex flex-row gap-1 mb-2">
          {/* Button: Most Viewed */}
          {/* <div
            className={`btn btn-sm ${
              filter === "mostViewed"
                ? "bg-gradient-to-r from-cyan-600 via-lime-500 to-lime-500 border-0 text-black"
                : "dark:bg-zinc-800 bg-zinc-200"
            }`}
            onClick={() => {
              setFilter("mostViewed");
              refetch();
            }}
          >
            <div className="flex flex-col w-6 h-6">
              <Image
                src="/yougotthis.png"
                width={150}
                height={150}
                alt="fresh"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <span>Most Viewed</span>
          </div> */}

          {/* Button: Rising */}
          <div
            className={`btn btn-sm ${
              filter === "latest"
                ? "bg-gradient-to-r from-cyan-600 via-lime-500 to-lime-500 border-0 text-black"
                : "dark:bg-zinc-800 bg-zinc-200"
            }`}
            onClick={() => {
              setFilter("latest");
              refetch();
            }}
          >
            <div className="flex flex-col w-6 h-6">
              <Image src="/1f525.gif" width={150} height={150} alt="rising" style={{ width: "auto", height: "auto" }} />
            </div>
            <span>Newest</span>
          </div>
        </div>

        {/* GRID FEED */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {feed.map((idea: any, index: any) => (
            <div
              key={index}
              className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-2xl p-6 text-white h-full transform transition-transform duration-300 hover:-translate-y-2"
            >
              {/* Background overlay */}
              <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform -skew-x-12"></div>

              {/* Card content */}
              <Link className="relative z-10 flex flex-col h-full" href={`/spark/${idea.id}`}>
                {/* Logo */}
                <div className="mb-4">
                  <Image
                    src={`/spark/spark-logo.png`}
                    alt="spark logo"
                    height={120}
                    width={120}
                    className="w-6 h-auto"
                    draggable={false}
                  />
                </div>

                {/* Tweet text */}
                <div className="line-clamp-5 text-lg text-opacity-90 mb-4">{formatText(idea.text)}</div>

                {/* Footer */}
                <div className="mt-auto flex flex-row items-center justify-between ">
                      <div className="flex flex-row items-center space-x-2">
                        <Avatar profile={idea.profile} width={10} height={10} />
                        <div className="text-sm">
                          @{idea.profile.username}
                        </div>
                        <span className="text-xs text-gray-300">
                          <TimeAgo timestamp={idea.created_at} />
                        </span>
                      </div>
                      <span className="flex flex-row items-center gap-1 text-xs text-gray-100">
                        <EyeIcon width={18} height={18} />
                        <FormatNumber number={idea.idea_views[0].view_count} />
                      </span>
                    </div>
              </Link>
            </div>
          ))}
        </div>

        {/* LOADING INDICATOR */}
        {loadingFeed && (
          <div className="flex flex-row justify-evenly items-end my-5">
            <div className="grow flex flex-row justify-center">
              <span className="loading loading-dots loading-sm"></span>
            </div>
          </div>
        )}

        {/* FETCH MORE */}
        <div
          className="btn relative flex flex-row items-center justify-center mt-2 border-b-2 cursor-pointer"
          onClick={() => fetchMore()}
        >
          <ArrowDownCircleIcon width={30} />
        </div>
      </div>
    </>
  );
};

export default Sparks;
