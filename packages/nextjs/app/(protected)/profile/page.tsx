"use client";

import { useContext, useEffect, useRef, useState } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AuthUserContext, AuthUserFollowsContext } from "../../context";
import { NextPage } from "next";
import { CircleStackIcon, UserIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import AvatarModal from "~~/components/wildfire/AvatarModal";
import FollowersModal from "~~/components/wildfire/FollowersModal";
import FollowingModal from "~~/components/wildfire/FollowingModal";
import FormatNumber from "~~/components/wildfire/FormatNumber";
import ThumbCard from "~~/components/wildfire/ThumCard";
import TipModal from "~~/components/wildfire/TipModal";
import TransactionsModal from "~~/components/wildfire/TransactionsModal";
import UsernameModal from "~~/components/wildfire/UsernameModal";
import VideoModal from "~~/components/wildfire/VideoModal";
import { useIncomingTransactions } from "~~/hooks/wildfire/useIncomingTransactions";
import { useProfileFeed } from "~~/hooks/wildfire/useProfileFeed";
import { useGlobalState } from "~~/services/store/store";
import { calculateSum } from "~~/utils/wildfire/calculateSum";
import { convertEthToUsd } from "~~/utils/wildfire/convertEthToUsd";
import { deleteFollow } from "~~/utils/wildfire/crud/followers";

const Profile: NextPage = () => {
  const ethPrice = useGlobalState(state => state.nativeCurrency.price);
  const fusePrice = useGlobalState(state => state.fuseCurrency.price);

  //CONSUME PROVIDERS
  const { profile } = useContext(AuthUserContext);
  const {
    loading: loadingFollows,
    followers,
    following,
    followed,
    refetchAuthUserFollows,
  } = useContext(AuthUserFollowsContext);

  //FETCH DIRECTLY
  const { loading: loadingFeed, feed, fetchMore } = useProfileFeed();
  const incomingRes = useIncomingTransactions(profile?.wallet_id);

  //DYNAMICALLY GENERATE LEVEL NAME
  const highestLevel = profile?.levels.reduce((max: number, item: any) => (item.level > max ? item.level : max), 0);
  const levelNames = ["noob", "creator", "builder", "architect", "visionary", "god-mode"];
  const levelName = levelNames[highestLevel] || "unknown";

  //BALANCE
  const ethSum = calculateSum(incomingRes.ethereumData);
  const fuseSum = calculateSum(incomingRes.fuseData);
  const baseSum = calculateSum(incomingRes.baseData);

  // Convert each network's balance to USD
  const ethUsd = convertEthToUsd(ethSum, ethPrice);
  const baseUsd = convertEthToUsd(baseSum, ethPrice);
  const fuseUsd = convertEthToUsd(fuseSum, fusePrice);
  const totalUsd = (ethUsd + baseUsd + fuseUsd).toFixed(2); // Total balance in USD

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
      threshold: 0.8, // Multiple thresholds for more accurate detection
    };

    const observer = new IntersectionObserver(callback, options);

    const videoCards = carousellRef.current.querySelectorAll(".carousel-item");

    videoCards.forEach(card => {
      observer.observe(card);
    });
  }, [feed]); // Ensure to run effect whenever feed changes

  const handleUnfollow = async () => {
    if (followed == true) {
      const error = await deleteFollow(profile.id, profile.id);
      if (!error) {
        refetchAuthUserFollows();
        closeFollowersModal();
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
  const [isFollowersModalOpen, setFollowersModalOpen] = useState(false);

  const closeFollowersModal = () => {
    setFollowersModalOpen(false);
  };

  //FOLLOWS MODAL
  const [isFollowingModalOpen, setFollowingModalOpen] = useState(false);

  const closeFollowingModal = () => {
    setFollowingModalOpen(false);
  };

  //AVATAR MODAL
  const [isAvatarModalOpen, setAvatarModalOpen] = useState(false);

  const closeAvatarModal = () => {
    setAvatarModalOpen(false);
  };

  //AVATAR MODAL
  const [isUsernameModalOpen, setUsernameModalOpen] = useState(false);

  const closeUsernameModal = () => {
    setUsernameModalOpen(false);
  };

  //TRANSACTIONS MODAL
  const [isTransactionsModalOpen, setTransactionsModalOpen] = useState(false);

  const closeTransactionsModal = () => {
    setTransactionsModalOpen(false);
  };

  return (
    <div className="flex flex-col-reverse md:flex-row items-start ">
      {/* MODALS */}
      {isVideoModalOpen && selectedVideo && <VideoModal data={selectedVideo} onClose={closeVideoModal} />}
      {isTipModalOpen && <TipModal data={profile} onClose={closeTipModal} />}
      {isTransactionsModalOpen && <TransactionsModal data={profile} onClose={closeTransactionsModal} />}
      {isFollowersModalOpen && (
        <FollowersModal data={{ profile, followers, followed }} onClose={closeFollowersModal} onCta={handleUnfollow} />
      )}
      {isFollowingModalOpen && <FollowingModal data={{ profile, following, followed }} onClose={closeFollowingModal} />}
      {isAvatarModalOpen && <AvatarModal onClose={closeAvatarModal} />}
      {isUsernameModalOpen && <UsernameModal onClose={closeUsernameModal} />}

      {/* NO FEED TO SHOW */}
      {!loadingFeed && feed && feed.length == 0 && (
        <div className="flex flex-row justify-center items-center w-full h-screen-custom grow">
          <Link className="btn btn-base-100" href={"/create"}>
            🤫 You haven't posted, yet.
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
        <div className="carousel carousel-center rounded-box w-full md:ml-2" ref={carousellRef}>
          {feed.map((thumb: any, index: any) => (
            <ThumbCard key={index} index={index} data={thumb} onCta={handleThumbClick} />
          ))}
        </div>
      )}

      {/* STAT */}
      <div className="stats shadow flex flex-col grow w-full md:w-[350px] h-full py-5 md:mx-2">
        <div className="stat">
          <div className="stat-title">Level</div>
          <div className="stat-value text-xl">{levelName}</div>
          <a href="https://www.wildpay.app/levels" className="stat-desc">
            Level up
          </a>
        </div>
        <div className="stat">
          <div className="stat-figure text-secondary">
            {profile?.avatar_url && (
              <div className="avatar online">
                <div className="w-12 rounded-full">
                  <Image
                    src={profile?.avatar_url}
                    width={60}
                    height={60}
                    alt="linear demo image"
                    className=""
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>
                <div
                  className="absolute bottom-0 rounded-full bg-white p-1 right-0"
                  onClick={() => setAvatarModalOpen(true)}
                >
                  <PencilIcon width={12} color="black" />
                </div>
              </div>
            )}
            {!profile?.avatar_url && (
              <div className="avatar placeholder online">
                <div className="bg-neutral text-neutral-content rounded-full w-12">
                  <span className="text-xl">{profile?.username.charAt(0).toUpperCase()}</span>
                </div>
                <div
                  className="absolute bottom-0 rounded-full bg-white p-1 right-0"
                  onClick={() => setAvatarModalOpen(true)}
                >
                  <PencilIcon width={12} color="black" />
                </div>
              </div>
            )}
          </div>
          {/* <div className="stat-title">Username</div> */}
          <div className="stat-value text-xl">{profile?.username}</div>
          <div className="stat-desc cursor-pointer" onClick={() => setUsernameModalOpen(true)}>
            Change
          </div>
        </div>
        <div className="stat cursor-pointer" onClick={() => setFollowersModalOpen(true)}>
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
        <div className="stat cursor-pointer" onClick={() => setFollowingModalOpen(true)}>
          <div className="stat-figure text-primary">
            <UserIcon width={60} />
          </div>
          <div className="stat-title">Following</div>
          <div className="stat-value text-primary">
            {!loadingFollows && following && following.length > 0 && <FormatNumber number={following.length} />}
            {!loadingFollows && following && following.length == 0 && "0"}
            {loadingFollows && <span className="loading loading-ring loading-sm"></span>}
          </div>
          <div className="stat-desc">See following</div>
        </div>
        <div onClick={() => setTransactionsModalOpen(true)} className="stat cursor-pointer hover:opacity-85">
          <div className="stat-figure text-primary">
            <CircleStackIcon width={60} />
          </div>
          <div className="stat-title">Incoming</div>
          <div className="stat-value text-primary">${totalUsd}</div>
          <div className="stat-desc">
            {totalUsd && ethPrice ? (parseFloat(totalUsd) / ethPrice).toFixed(4) : "0.0000"} ETH
          </div>
        </div>
        <div className="stat">
          <div className="btn btn-primary" onClick={() => setTipModalOpen(true)}>
            Send Love
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
