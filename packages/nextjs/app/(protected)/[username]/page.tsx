"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useGlobalState } from "@/services/store/store";
import { CheckCircleIcon, CircleStackIcon, UserIcon } from "@heroicons/react/24/outline";

import { AuthContext, AuthUserFollowsContext } from "@/app/context";
import FollowersModal from "@/components/wildfire/FollowersModal";
import FormatNumber from "@/components/wildfire/FormatNumber";
import ThumbCard from "@/components/wildfire/ThumbCard";
import TipModal from "@/components/wildfire/TipModal";
import TransactionsModal from "@/components/wildfire/TransactionsModal";
import VideoModal from "@/components/wildfire/VideoModal";
import { useIncomingTransactions } from "@/hooks/wildfire/useIncomingTransactions";
import { useUserFeedByUsername } from "@/hooks/wildfire/useUserFeedByUsername";
import { useUserFollowsByUsername } from "@/hooks/wildfire/useUserFollowsByUsername";
import { useUserProfileByUsername } from "@/hooks/wildfire/useUserProfileByUsername";
import { calculateSum } from "@/utils/wildfire/calculateSum";
import { convertEthToUsd } from "@/utils/wildfire/convertEthToUsd";
import { deleteFollow, insertFollow } from "@/utils/wildfire/crud/followers";

const Profile: NextPage = () => {
  const { username } = useParams();
  const price = useGlobalState(state => state.nativeCurrency.price);
  const router = useRouter();

  //CONSUME PROVIDERS
  const { isAuthenticated, user } = useContext(AuthContext);
  const { refetchAuthUserFollows } = useContext(AuthUserFollowsContext);

  //FETCH DIRECTLY
  const { loading: loadingProfile, profile } = useUserProfileByUsername(username);
  const {
    loading: loadingFollows,
    followers,
    followed,
    refetch: refetchProfileFollows,
  } = useUserFollowsByUsername(user, username);
  const { loading: loadingFeed, feeds, fetchMore } = useUserFeedByUsername(username);
  const incomingRes = useIncomingTransactions(profile?.wallet_id);

  //DYNAMICALLY GENERATE LEVEL NAME
  const highestLevel = profile?.levels?.reduce((max: number, item: any) => (item.level > max ? item.level : max), 0);
  const levelNames = ["Noob", "Creator", "Builder", "Architect", "Visionary", "God-mode"];
  const levelName = levelNames[highestLevel] || "unknown";
  const balance = (calculateSum(incomingRes.ethereumData) + calculateSum(incomingRes.baseData)).toFixed(4);

  //FETCH MORE FEED
  const carousellRef = useRef<HTMLDivElement>(null);
  const [carouselObserver, setCarouselObserver] = useState<IntersectionObserver>();

  useEffect(() => {
    if (!carousellRef.current) return;

    carouselObserver?.disconnect();

    const options = {
      root: carousellRef.current,
      rootMargin: "0px",
      threshold: 0.8, // Multiple thresholds for more accurate detection
    };

    const observer = new IntersectionObserver(entries => {
      const lastItemIndex = feeds.length - 1;

      // Callback function for Intersection Observer

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute("data-index") || "0");

          console.log("[lastItemIndex]", lastItemIndex);
          if (index === lastItemIndex) fetchMore();
        }
      });
    }, options);

    const videoCards = carousellRef.current.querySelectorAll(".carousel-item");

    videoCards.forEach(card => {
      observer.observe(card);
    });

    setCarouselObserver(observer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeds]); // Ensure to run effect whenever feed changes

  const handleFollow = async () => {
    if (followed == false) {
      const error = await insertFollow(user?.id, profile.id);
      if (!error) {
        refetchProfileFollows();
        refetchAuthUserFollows();
      } else {
        console.log("error", error);
      }
    } else {
      setFollowsModalOpen(true);
    }
  };

  const handleUnfollow = async () => {
    if (followed == true) {
      const error = await deleteFollow(user?.id, profile.id);
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
    if (isAuthenticated == false) {
      router.push("/login");
    } else {
      console.log("id", id);
      console.log("[Playback ID]", id.playback_id);
      setSelectedVideo(id);
      setIsVideoModalOpen(true);
    }
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

  //TRANSACTIONS MODAL
  const [isTransactionsModalOpen, setTransactionsModalOpen] = useState(false);

  const closeTransactionsModal = () => {
    setTransactionsModalOpen(false);
  };

  if (profile) {
    return (
      <div className="flex flex-col-reverse md:flex-row items-start h-full">
        {/* MODALS */}
        {isVideoModalOpen && selectedVideo && <VideoModal data={selectedVideo} onClose={closeVideoModal} />}
        {isTipModalOpen && <TipModal data={profile} onClose={closeTipModal} />}
        {isTransactionsModalOpen && <TransactionsModal data={profile} onClose={closeTransactionsModal} />}
        {isFollowsModalOpen && (
          <FollowersModal data={{ profile, followers, followed }} onClose={closeFollowsModal} onCta={handleUnfollow} />
        )}
        {/* NO FEED TO SHOW */}
        {!loadingFeed && feeds && feeds.length == 0 && (
          <div className="flex flex-row justify-center items-center w-full h-screen-custom grow">
            <Link className="mt-5 md:mt-0 btn btn-base-100" href={"/watch"}>
              🤫 User hasn't posted, yet.
            </Link>
          </div>
        )}

        {/* LOADING INITIAL FEED */}
        {loadingFeed && feeds && feeds.length == 0 && (
          <div className="flex flex-row justify-center items-center w-full h-screen-custom grow">
            <span className="loading loading-ring loading-lg"></span>
          </div>
        )}

        {/* RENDER FEED */}
        {feeds && feeds.length > 0 && (
          <div className="carousel carousel-center rounded-box w-full md:ml-2" ref={carousellRef}>
            {feeds.map((feed: any, index: any) => (
              <ThumbCard key={index} index={index} data={feed} onCta={handleThumbClick} />
            ))}
          </div>
        )}
        {/* FETCH MORE */}
        {/* {loadingFeed && (
          <div className="flex flex-row justify-center items-center h-screen-custom grow mx-4">
            <span className="loading loading-dots loading-sm"></span>
          </div>
        )} */}
        <div className="stats shadow flex flex-col grow w-full md:w-[350px] py-5 md:mx-2">
          <Link href={"/" + username} className="stat cursor-pointer hover:opacity-85">
            {/* <div className="stat-figure text-secondary">
              {profile?.avatar_url && (
                <div className="avatar placeholder">
                  <div className="w-12 rounded-full">
                    <img src={profile?.avatar_url} alt="avatar" />
                  </div>
                </div>
              )}
              {!profile?.avatar_url && (
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-12">
                    <span className="text-xl">{profile?.username.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
              )}
            </div> */}
            <div className="stat-value text-lg pb-2">{username}</div>
            <div className="stat-title">Level</div>
            <div className="stat-value text-3xl">{levelName}</div>
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
          <div onClick={() => setTransactionsModalOpen(true)} className="stat cursor-pointer hover:opacity-85">
            <div className="stat-figure text-primary">
              <CircleStackIcon width={60} />
            </div>

            <div className="stat-title">Received</div>
            <div className="stat-value text-primary">${convertEthToUsd(balance, price)}</div>
            <div className="stat-desc">{balance} ETH</div>
          </div>
          <div className="px-5 my-2">
            {isAuthenticated == false && (
              <Link href="/login" className="btn bg-base-200 w-full relative">
                Follow
              </Link>
            )}
            {isAuthenticated == true && (
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
            )}
          </div>
          <div className="px-5">
            {isAuthenticated == true && (
              <div className="btn btn-primary w-full" onClick={() => setTipModalOpen(true)}>
                Tip Now
              </div>
            )}
            {isAuthenticated == false && (
              <Link href="/login" className="btn btn-primary w-full">
                Tip Now
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  } else if (!loadingProfile && !profile) {
    return <>User Not Found</>;
  }
};

export default Profile;
