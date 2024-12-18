"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NextPage } from "next";
import { AuthUserFollowsContext } from "~~/app/context";
import VideoModal from "~~/components/wildfire/VideoModal";
import { useUserFollowingShortsFeed } from "~~/hooks/wildfire/useUserFollowingShortsFeed";
import { useRouter } from "next/navigation";
import FormatNumber from "~~/components/wildfire/FormatNumber";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import { useUserFollowingVideosFeed } from "~~/hooks/wildfire/useUserFollowingVideosFeed";
import { Avatar } from "~~/components/Avatar";
import { TimeAgo } from "~~/components/wildfire/TimeAgo";
import { useUserFollowingSparksFeed } from "~~/hooks/wildfire/useUserFollowingSparksFeed";
import React from "react";

const Feed: NextPage = () => {

  const router = useRouter();

  //CONSUME PROVIDERS
  const { following } = useContext(AuthUserFollowsContext);

  //FETCH DIRECTLY
  const { loading: loadingUserSparksFeed, feed: userSparksFeed, fetchMore: fetchMoreSparks } = useUserFollowingSparksFeed(6);
  const { loading: loadingUserVideosFeed, feed: userVideosFeed, fetchMore: fetchMoreVideos } = useUserFollowingVideosFeed(6);
  const { loading: loadingUserShortsFeed, feed: userShortsFeed, fetchMore: fetchMoreShorts } = useUserFollowingShortsFeed(6);

  console.log("userSparksFeed", userSparksFeed);

  //STATES
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeTab, setActiveTab] = useState<"sparks" | "videos" | "shorts">("sparks");

  const closeModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
  };

    // Helper function to format text with hashtags and mentions
    const formatText = (text: string) => {
      return text.split("\n").map((line, i) => (
        <React.Fragment key={i}>
          {line
            .split(/(#\w+|@\w+)/g) // Split text into parts with hashtags/mentions
            .map((part, index) => {
              if (part.startsWith("#")) {
                return (
                  <Link href="/" key={index} className="text-primary">
                    {part}
                  </Link>
                );
              } else if (part.startsWith("@")) {
                return (
                  <Link href={`/${part.substring(1)}`} key={index} className="text-primary">
                    {part}
                  </Link>
                );
              } else {
                return part;
              }
            })}
          <br />
        </React.Fragment>
      ));
    };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "sparks":
        return (
          <div className="mr-2 mb-1">
            <div className="grid grid-cols-3 gap-6 p-6">
              {userSparksFeed.map(idea => (
                <div
                  key={idea.id}
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
                    <div className="mt-auto flex flex-row items-center space-x-2">
                      <Avatar profile={idea.profile} width={10} height={10} />
                      <Link href={`/${idea.profile.username}`} className="text-sm">
                        @{idea.profile.username}
                      </Link>
                      <span className="text-xs text-gray-300">
                        <TimeAgo timestamp={idea.created_at} />
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {loadingUserSparksFeed && (
              <div className="flex flex-row justify-evenly items-end my-5">
                <div className="grow flex flex-row justify-center">
                  <span className="loading loading-dots loading-sm"></span>
                </div>
              </div>
            )}

            {!loadingUserSparksFeed && userSparksFeed && userSparksFeed.length == 0 ? (
              <div className="flex flex-col justify-center items-center w-full md:h-screen-custom grow my-10">
                <Image src="/dark_800x800.png" alt={""} width={80} height={80} />
                <Link className="mt-5 md:mt-0" href={"/ideas"}>
                  No sparks found.
                </Link>
              </div>
            ) : (
              <>
                <div
                  className="btn relative flex flex-row items-center justify-center mt-2 border-b-2 cursor-pointer"
                  onClick={() => fetchMoreSparks()}
                >
                  <ArrowDownCircleIcon width={30} />
                </div>
              </>
            )}
          </div>
        );
      case "videos":
        return (
          <div className="grow mr-2 mb-1">
            <div className="grid grid-cols-3 gap-1">
              {userVideosFeed?.map(video => (
                <div key={video.id} className="flex flex-col mt-1">
                  <video
                    width="100%"
                    height="auto"
                    className="rounded-lg"
                    poster={video.thumbnail_url}
                    controls
                    onMouseEnter={e => e.currentTarget.play()} // Autoplay on hover
                    onMouseLeave={e => e.currentTarget.pause()} // Stop on mouse leave
                  >
                    <source src={video.video_url + "#t=0,10"} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <a href={`/video/${video.id}`} className="font-medium mt-2 line-clamp-2">
                    {video.title}
                  </a>
                  <a href={`/${video.profile.username}`} className="flex flex-row gap-1 items-center text-sm mt-1 opacity-85">
                    <Avatar profile={video.profile} width={7} height={7} />
                    <span>@{video.profile.username}</span>
                  </a>
                  <div className="text-sm mt-1 font-medium flex flex-row gap-1 opacity-85">
                <div>
                <FormatNumber number={video.long_form_views[0].view_count} /> views
                </div>
                <div>•</div>
                <div className="flex flex-row gap-1">
                  <TimeAgo timestamp={video.created_at} /> <span>ago</span>
                </div>
              </div>            
                </div>
              ))}
            </div>
            {loadingUserVideosFeed && (
              <div className="flex flex-row justify-evenly items-end my-5">
                <div className="grow flex flex-row justify-center">
                  <span className="loading loading-dots loading-sm"></span>
                </div>
              </div>
            )}

            {!loadingUserVideosFeed && userVideosFeed && userVideosFeed.length == 0 ? (
              <div className="flex flex-col justify-center items-center w-full md:h-screen-custom grow my-10">
                <Image src="/dark_800x800.png" alt={""} width={80} height={80} />
                <Link className="mt-5 md:mt-0" href={"/shorts"}>
                  No videos found.
                </Link>
              </div>
            ) : (
              <div
                className="btn relative flex flex-row items-center justify-center mt-2 border-b-2 cursor-pointer"
                onClick={() => fetchMoreVideos()}
              >
                <ArrowDownCircleIcon width={30} />
              </div>
            )}
          </div>
        );
      case "shorts":
        return (
          <div className="grow mt-2 mr-2 mb-1">
            <div className="grid grid-cols-6 rounded-box">
              {userShortsFeed && userShortsFeed?.length > 0 && userShortsFeed?.map((short: any) => (
                <div
                  key={short.id}
                  className="mr-1 flex flex-col mt-1 cursor-pointer"
                  onClick={() => router.replace(`/v/${short.id}`)}
                >
                  <video
                    width="100%"
                    height="auto"
                    className="rounded-lg"
                    muted
                    poster={short.thumbnail_url} // Use thumbnail as a poster
                    onMouseEnter={e => e.currentTarget.play()} // Autoplay on hover
                    onMouseLeave={e => e.currentTarget.pause()} // Stop on mouse leave
                  >
                    <source src={short.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <span className="text-sm font-medium">
                    {<FormatNumber number={short["3sec_views"][0].view_count} />} views
                  </span>
                  <a href={`/${short.profile.username}`} className="text-sm">
                    @{short.profile.username}
                  </a>
                </div>
              ))}
            </div>
            {loadingUserShortsFeed && (
              <div className="flex flex-row justify-evenly items-end my-5">
                <div className="grow flex flex-row justify-center">
                  <span className="loading loading-dots loading-sm"></span>
                </div>
              </div>
            )}

            {!loadingUserShortsFeed && userShortsFeed && userShortsFeed.length == 0 ? (
              <div className="flex flex-col justify-center items-center w-full md:h-screen-custom grow my-10">
                <Image src="/dark_800x800.png" alt={""} width={80} height={80} />
                <Link className="mt-5 md:mt-0" href={"/shorts"}>
                  No shorts found.
                </Link>
              </div>
            ) : (
              <div
                className="btn relative flex flex-row items-center justify-center mt-2 border-b-2 pb- cursor-pointer mb-2"
                onClick={() => fetchMoreShorts()}
              >
                <ArrowDownCircleIcon width={30} />
              </div>
            )}

          </div>)
    }
  };

  return (
    <>
      <div id="feed-page" className="flex flex-row h-screen-custom overflow-scroll p-2">

        {/* FOLLOWING */}

        <div className="flex flex-col min-w-min gap-2 md:gap-3 pl-2 md:pl-0 pr-2 overflow-scroll">
          {following?.map((following: any, index: number) => (
            <Link key={index} href={"/" + following.following.username} className="">
              <div className="">
                {following.following.avatar_url && (
                  <div className="avatar">
                    <div className="w-10 md:w-12 rounded-full">
                      <Image src={following.following.avatar_url} alt="avatar" width={20} height={20} priority />
                    </div>
                  </div>
                )}
                {!following.following.avatar_url && (
                  <div className="avatar placeholder">
                    <div className="bg-base-100 text-primary-content rounded-full w-10 md:w-12">
                      <span className="text-3xl">{following.following.username.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      
        {/* TABS */}
        <div className="mt-4 mb-4">
          <div className="flex gap-20 border-b border-gray-300 mb-4">
            <button
              onClick={() => setActiveTab("sparks")}
              className={`flex-1 py-2 text-center ${activeTab === "sparks" ? "border-b-2 border-secondary font-bold" : "text-gray-500"
                }`}
            >
              Sparks ({ userSparksFeed.length || 0 })
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`flex-1 py-2 text-center ${activeTab === "videos" ? "border-b-2 border-secondary font-bold" : "text-gray-500"
                }`}
            >
              Videos ({userVideosFeed?.length || 0 })
            </button>
            <button
              onClick={() => setActiveTab("shorts")}
              className={`flex-1 py-2 text-center ${activeTab === "shorts" ? "border-b-2 border-secondary font-bold" : "text-gray-500"
                }`}
            >
              Shorts ({userShortsFeed?.length || 0})
            </button>
          </div>
          <div>{renderActiveTabContent()}</div>
        </div>

        

        {/* MODAL */}
        {isVideoModalOpen && selectedVideo && <VideoModal data={selectedVideo} onClose={closeModal} />}
      </div>
    </>
  );
};

export default Feed;
