"use client";

import { useContext, useState } from "react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

import { AuthContext, AuthUserFollowsContext } from "@/app/context";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import VideoModal from "@/components/wildfire/VideoModal";
import { useUserFollowedFeed } from "@/hooks/wildfire/useUserFollowingFeed";

const Feed: NextPage = () => {
  //CONSUME PROVIDERS
  const { user } = useContext(AuthContext);
  const { loadingFollows, following } = useContext(AuthUserFollowsContext);

  //FETCH DIRECTLY
  const { loading: loadingUserFeed, feed: userFeed, fetchMore } = useUserFollowedFeed(user, following);

  //STATES
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  const handleParalaxClick = (id: any) => {
    console.log("clicked", id);
    const res = userFeed.find((item: any) => item.id === id);
    setSelectedVideo(res);
    setIsVideoModalOpen(true);
  };

  const closeModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
  };

  // Toggle mute state
  const handleOnCtaMute = (mute: any) => {
    setIsMuted(mute);
  };

  return (
    <>
      <div id="feed-page" className="flex flex-col md:flex-row-reverse h-full">
        {/* FOLLOWING */}
        <div className="flex flex-row md:flex-col gap-2 md:gap-3 h-full overflow-scroll pl-2 md:pl-0 pr-2">
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

        {/* FIRST TIME USER */}
        {!loadingFollows && following && following.length == 0 && (
          <div className="flex flex-row justify-center items-center grow">
            <Link className="btn btn-base-100" href={"/creators"}>
              🥳 Start following someone
            </Link>
          </div>
        )}

        {/* INITAL LOADING FEED */}
        {!loadingFollows &&
          following &&
          following.length > 0 &&
          loadingUserFeed &&
          userFeed &&
          userFeed.length == 0 && (
            <div className="flex flex-row justify-center items-center grow">
              <span className="loading loading-ring loading-lg"></span>
            </div>
          )}

        {/* RENDER FEED */}
        {userFeed && userFeed.length > 0 && (
          <ParallaxScroll
            data={userFeed}
            onCta={handleParalaxClick}
            fetchMore={() => fetchMore()}
            loading={loadingUserFeed}
            isMuted={isMuted}
            onCtaMute={handleOnCtaMute}
          />
        )}

        {/* MODAL */}
        {isVideoModalOpen && selectedVideo && <VideoModal data={selectedVideo} onClose={closeModal} />}
      </div>
    </>
  );
};

export default Feed;
