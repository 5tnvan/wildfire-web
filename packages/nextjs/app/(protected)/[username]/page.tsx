"use client";

import { useContext, useEffect, useRef, useState } from "react";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { NextPage } from "next";
import { CheckCircleIcon, CircleStackIcon, UserIcon } from "@heroicons/react/24/outline";
import { AuthContext, AuthUserFollowsContext } from "~~/app/context";
import FollowersModal from "~~/components/wildfire/FollowersModal";
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
import { deleteFollow, insertFollow } from "~~/utils/wildfire/crud/followers";

const Profile: NextPage = () => {
  const { username } = useParams();
  const price = useGlobalState(state => state.nativeCurrency.price);

  //CONSUME PROVIDERS
  const { user } = useContext(AuthContext);
  const { refetchAuthUserFollows } = useContext(AuthUserFollowsContext);

  //FETCH DIRECTLY
  const { loading: loadingProfile, profile } = useUserProfileByUsername(username);
  const {
    loading: loadingFollows,
    followers,
    followed,
    refetch: refetchProfileFollows,
  } = useUserFollowsByUsername(username);
  const { loading: loadingFeed, feed, fetchMore } = useUserFeedByUsername(username);
  const incomingRes = useIncomingTransactions(profile?.wallet_id);

  //DYNAMICALLY GENERATE LEVEL NAME
  const highestLevel = profile?.levels?.reduce((max: number, item: any) => (item.level > max ? item.level : max), 0);
  const levelNames = ["Noob", "Creator", "Builder", "Architect", "Visionary", "God-mode"];
  const levelName = levelNames[highestLevel] || "unknown";
  const balance = (calculateSum(incomingRes.ethereumData) + calculateSum(incomingRes.baseData)).toFixed(4);

  //FETCH MORE FEED
  const carousellRef = useRef<HTMLDivElement>(null);
  const lastItemIndex = feed.length - 1;

  // Callback function for Intersection Observer
  const callback = (entries: any) => {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        const index = entry.target.getAttribute("data-index");
        console.log("lastItemId", lastItemIndex);
        console.log("index", index);
        if (index == lastItemIndex) {
          console.log("i am hereee");
          fetchMore();
        }
      }
    });
  };

  useEffect(() => {
    if (!carousellRef.current) return;

    const options = {
      root: carousellRef.current,
      rootMargin: "0px",
      threshold: 0.3, // Multiple thresholds for more accurate detection
    };

    const observer = new IntersectionObserver(callback, options);

    const videoCards = carousellRef.current.querySelectorAll(".carousel-item");

    videoCards.forEach(card => {
      observer.observe(card);
    });
  }, [feed]); // Ensure to run effect whenever feed changes

  const handleFollow = async () => {
    if (followed == false) {
      const error = await insertFollow(user.id, profile.id);
      if (!error) {
        refetchProfileFollows();
        refetchAuthUserFollows();
      }
    } else {
      setFollowsModalOpen(true);
    }
  };

  const handleUnfollow = async () => {
    if (followed == true) {
      const error = await deleteFollow(user.id, profile.id);
      if (!error) {
        refetchProfileFollows();
        refetchAuthUserFollows();
        closeFollowsModal();
      }
    }
  };

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

  //FOLLOWS MODAL
  const [isFollowsModalOpen, setFollowsModalOpen] = useState(false);

  const closeFollowsModal = () => {
    setFollowsModalOpen(false);
  };

  if (profile) {
    return (
      <div className="flex flex-col-reverse md:flex-row items-start ">
        {/* MODALS */}
        {isVideoModalOpen && selectedVideo && <VideoModal data={selectedVideo} onClose={closeVideoModal} />}
        {isTipModalOpen && <TipModal data={profile} onClose={closeTipModal} />}
        {isFollowsModalOpen && (
          <FollowersModal data={{ profile, followers, followed }} onClose={closeFollowsModal} onCta={handleUnfollow} />
        )}

        {/* NO FEED TO SHOW */}
        {!loadingFeed && feed && feed.length == 0 && (
          <div className="flex flex-row justify-center items-center w-full md:h-screen-custom grow">
            <Link className="mt-5 md:mt-0 btn btn-base-100" href={"/watch"}>
              🤫 User hasn't posted, yet.
            </Link>
          </div>
        )}

        {/* LOADING INITIAL FEED */}
        {loadingFeed && feed && feed.length == 0 && (
          <div className="flex flex-row justify-center items-center h-screen-custom w-full grow">
            <span className="loading loading-ring loading-lg"></span>
          </div>
        )}

        {/* RENDER FEED */}
        {feed && feed.length > 0 && (
          <>
            <div className="carousel carousel-center rounded-box w-full ml-2" ref={carousellRef}>
              {feed.map((thumb: any, index: any) => (
                <ThumbCard key={index} index={index} data={thumb} onCta={handleThumbClick} />
              ))}
            </div>
          </>
        )}
        {/* FETCH MORE */}
        {/* {loadingFeed && (
          <div className="flex flex-row justify-center items-center h-screen-custom grow mx-4">
            <span className="loading loading-dots loading-sm"></span>
          </div>
        )} */}
        <div className="stats shadow flex flex-col grow w-full md:w-[350px] h-full py-5 md:mx-2">
          <Link href={"/" + username} className="stat cursor-pointer hover:opacity-85">
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
          </Link>
          <div className="stat cursor-pointer hover:opacity-85" onClick={() => setFollowsModalOpen(true)}>
            <div className="stat-figure text-primary">
              <UserIcon width={60} />
            </div>
            <div className="stat-title">Followers</div>
            <div className="stat-value text-primary">
              {!loadingFollows && followers && followers.length > 0 && <FormatNumber number={followers.length} />}
              {!loadingFollows && followers && followers.length == 0 && "0"}
              {loadingFollows && <span className="loading loading-ring loading-sm"></span>}
            </div>
            <div className="stat-desc">See followers</div>
          </div>
          <Link href={"https://www.wildpay.app/" + profile?.username} target="new" className="stat cursor-pointer hover:opacity-85">
            <div className="stat-figure text-primary">
              <CircleStackIcon width={60} />
            </div>

            <div className="stat-title">Balance</div>
            <div className="stat-value text-primary">${convertEthToUsd(balance, price)}</div>
            <Link href={"https://www.wildpay.app/" + profile?.username} className="stat-desc">
              {balance} ETH
            </Link>
          </Link>
          <div className="px-5 my-2">
            <div className="btn bg-base-200 w-full relative" onClick={handleFollow}>
              {loadingFollows && <span className="loading loading-ring loading-sm"></span>}
              {!loadingFollows && followed == true && (
                <>
                  <span>Following</span>
                  <CheckCircleIcon width={18} className="absolute right-3 opacity-30" />
                </>
              )}
              {!loadingFollows && followed == false && (
                <>
                  <span>Follow</span>
                </>
              )}
            </div>
          </div>
          <div className="px-5">
            <div className="btn btn-primary w-full" onClick={() => setTipModalOpen(true)}>
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
