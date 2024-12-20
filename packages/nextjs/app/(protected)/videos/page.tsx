"use client";

import { useState } from "react";
import Image from "next/image";
import { NextPage } from "next";
import { ArrowDownCircleIcon } from "@heroicons/react/24/solid";
import FormatNumber from "~~/components/wildfire/FormatNumber";
import { TimeAgo } from "~~/components/wildfire/TimeAgo";
import { useVideosFeed } from "~~/hooks/wildfire/useVideosFeed";
import { Avatar } from "~~/components/Avatar";

const Watch: NextPage = () => {
  const [filter, setFilter] = useState("mostViewed");

  // FETCH DIRECTLY
  const { loading: loadingFeed, feed, fetchMore, refetch } = useVideosFeed(filter, 6, 6);

  return (
    <>
      <div className="mx-2 h-screen-custom overflow-scroll">
        {/* FILTER */}
        <div className="flex flex-row gap-1">
          {/* Button: Popular */}
          <div
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
          </div>

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
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {feed.map((video, index) => (
            <div key={index} className="flex flex-col mt-1">
              <video
                width="100%"
                height="auto"
                className="rounded-lg"
                poster={video.long_form ? video.long_form.thumbnail_url : video.thumbnail_url}
                controls
                controlsList="nofullscreen"
                onMouseEnter={e => e.currentTarget.play()} // Autoplay on hover
                onMouseLeave={e => e.currentTarget.pause()} // Stop on mouse leave
              >
                <source src={video.long_form ? video.long_form.video_url : video.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <a
                href={`/video/${video.long_form ? video.long_form.id : video.id}`}
                className="font-medium mt-2 line-clamp-2"
              >
                {video.long_form ? video.long_form.title : video.title}
              </a>
              {video.long_form ? (
                <>
                  <a href={`/${video.long_form.profile.username}`} className="flex flex-row gap-1 items-center text-sm mt-1 opacity-85">
                    <Avatar profile={video.long_form.profile} width={7} height={7} />
                    <span>@{video.long_form.profile.username}</span>
                  </a>
                </>
              ) : (
                  <>
                    <a href={`/${video.profile.username}`} className="flex flex-row gap-1 items-center text-sm mt-1 opacity-85">
                      <Avatar profile={video.profile} width={7} height={7} />
                      <span>@{video.profile.username}</span>
                    </a>
                  </>
              )}

              <div className="text-sm mt-1 font-medium flex flex-row gap-1 opacity-85">
                <div>
                  {video.long_form_views ? (
                    <>
                      <FormatNumber number={video.long_form_views[0].view_count} /> views
                    </>
                  ) : (
                    <>
                      <FormatNumber number={video.view_count} /> views
                    </>
                  )}
                </div>
                <div>•</div>
                <div className="flex flex-row gap-1">
                  <TimeAgo timestamp={video.created_at} /> <span>ago</span>
                </div>
              </div>
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

export default Watch;
