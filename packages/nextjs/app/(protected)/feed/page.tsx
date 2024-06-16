"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NextPage } from "next";
import { AuthUserFollowsContext } from "~~/app/context";
import { ParallaxScroll } from "~~/components/ui/parallax-scroll";
import VideoModal from "~~/components/wildfire/VideoModal";
import { useUserFollowedFeed } from "~~/hooks/wildfire/useUserFollowingFeed";

const Feed: NextPage = () => {
  //CONSUME PROVIDERS
  const { loadingFollows, following } = useContext(AuthUserFollowsContext);

  //FETCH DIRECTLY
  const { loading: loadingUserFeed, feed: userFeed, fetchMore } = useUserFollowedFeed();

  //STATES
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

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

  return (
    <>
      <div id="feed-page" className="flex flex-row">
        {/* FIRST TIME USER */}
        {!loadingFollows && following && following.length == 0 && (
          <div className="flex flex-row justify-center items-center grow">
            <Link className="btn btn-base-100" href={"/watch"}>
              🥳 Start following someone
            </Link>
          </div>
        )}

        {/* LOADING FEED */}
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
          <ParallaxScroll data={userFeed} onCta={handleParalaxClick} fetchMore={() => fetchMore()} />
        )}

        {/* MODAL */}
        {isVideoModalOpen && selectedVideo && <VideoModal data={selectedVideo} onClose={closeModal} />}

        {/* FOLLOWING */}
        <div className="flex flex-col gap-3 h-screen-custom overflow-scroll pr-2">
          {following?.map((following: any, index: number) => (
            <Link key={index} href={"/" + following.following.username} className="">
              <div className="">
                {following.following.avatar_url && (
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <Image src={following.following.avatar_url} alt="avatar" width={20} height={20} priority />
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
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Feed;
