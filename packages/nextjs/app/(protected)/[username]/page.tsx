"use client";

import { useState } from "react";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { NextPage } from "next";
import { CircleStackIcon, UserIcon } from "@heroicons/react/24/outline";
import FormatNumber from "~~/components/wildfire/FormatNumber";
import ThumbCard from "~~/components/wildfire/ThumCard";
import TipModal from "~~/components/wildfire/TipModal";
import VideoModal from "~~/components/wildfire/VideoModal";
import { useIncomingTransactions } from "~~/hooks/wildfire/useIncomingTransactions";
import { useUserFeedByUsername } from "~~/hooks/wildfire/useUserFeedByUsername";
import { useUserFollowsByUsername } from "~~/hooks/wildfire/useUserFollowsByUsername";
import { useUserProfileByUsername } from "~~/hooks/wildfire/useUserProfileByUsername";
import { useGlobalState } from "~~/services/store/store";
import { calculateSum } from "~~/utils/wildfire/calculateSum";
import { convertEthToUsd } from "~~/utils/wildfire/convertEthToUsd";

const Profile: NextPage = () => {
  const { username } = useParams();
  const price = useGlobalState(state => state.nativeCurrency.price);

  //FETCH DIRECTLY
  const { loading: loadingProfile, profile } = useUserProfileByUsername(username);
  const { loading: loadingFollows, followers } = useUserFollowsByUsername(username);
  const { loading: loadingFeed, feed } = useUserFeedByUsername(username);
  const incomingRes = useIncomingTransactions(profile?.wallet_id);

  //DYNAMICALLY GENERATE LEVEL NAME
  const highestLevel = profile?.levels?.reduce((max: number, item: any) => (item.level > max ? item.level : max), 0);
  const levelNames = ["Noob", "Creator", "Builder", "Architect", "Visionary", "God-mode"];
  const levelName = levelNames[highestLevel] || "unknown";
  const balance = (calculateSum(incomingRes.ethereumData) + calculateSum(incomingRes.baseData)).toFixed(4);

  console.log("profile", profile?.id);
  console.log("followers", followers);
  console.log("feed", feed);
  console.log("incomingRes", incomingRes);

  //VID MODAL
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleThumbClick = (id: any) => {
    console.log("id", id);
    const res = feed.find((item: any) => item.id === id);
    setSelectedVideo(res);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
  };

  //TIP MODAL
  const [isTipModalOpen, setTipModalOpen] = useState(false);

  const closeTipModal = () => {
    setTipModalOpen(false);
  };

  if (profile) {
    return (
      <div className="flex flex-row items-start ">
        {/* MODALS */}
        {isVideoModalOpen && selectedVideo && <VideoModal data={selectedVideo} onClose={closeVideoModal} />}
        {isTipModalOpen && <TipModal data={profile} onClose={closeTipModal} />}

        {/* NO FEED TO SHOW */}
        {!loadingFeed && feed && feed.length == 0 && (
          <div className="flex flex-row justify-center items-center w-full h-screen-custom grow">
            <Link className="btn btn-base-100" href={"/watch-vertical"}>
              🤫 User hasn't posted, yet.
            </Link>
          </div>
        )}

        {/* LOADING FEED */}
        {loadingFeed && feed && feed.length == 0 && (
          <div className="flex flex-row justify-center items-center h-screen-custom w-full grow">
            <span className="loading loading-ring loading-lg"></span>
          </div>
        )}

        {/* RENDER FEED */}
        {feed && feed.length > 0 && (
          <div className="carousel carousel-center rounded-box w-full ml-2">
            {feed.map((thumb: any, index: any) => (
              <ThumbCard key={index} index={index} data={thumb} onCta={handleThumbClick} />
            ))}
          </div>
        )}

        <div className="stats shadow flex flex-col grow w-[350px] h-full py-5 mx-2">
          <div className="stat">
            <div className="stat-figure text-secondary">
              {profile?.avatar_url && (
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img src={profile?.avatar_url} />
                  </div>
                </div>
              )}
              {!profile?.avatar_url && (
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-12">
                    <span className="text-3xl">{profile?.username.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="stat-title">{levelName}</div>
            <div className="stat-value text-3xl">{profile.username}</div>
            {/* <div className="stat-desc">Level up</div> */}
          </div>
          <div className="stat">
            <div className="stat-figure text-primary">
              <UserIcon width={60} />
            </div>
            <div className="stat-title">Followers</div>
            <div className="stat-value text-primary">
              {!loadingFollows && followers && followers.length > 0 && <FormatNumber number={followers.length} />}
              {!loadingFollows && followers && followers.length == 0 && "0"}
              {loadingFollows && <span className="loading loading-ring loading-sm"></span>}
            </div>
            {/* <div className="stat-desc">See followers</div> */}
          </div>
          <div className="stat">
            <div className="stat-figure text-primary">
              <CircleStackIcon width={60} />
            </div>

            <div className="stat-title">Balance</div>
            <div className="stat-value text-primary">${convertEthToUsd(balance, price)}</div>
            <Link href={"https://www.wildpay.app/" + profile?.username} className="stat-desc">
              {balance} ETH
            </Link>
          </div>
          <div className="stat">
            <div className="btn btn-primary" onClick={() => setTipModalOpen(true)}>
              Tip Now
            </div>
          </div>
        </div>
      </div>
    );
  } else if (!loadingProfile && !profile) {
    return <>User Not Found</>;
  }
};

export default Profile;
