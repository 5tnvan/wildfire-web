"use client";

import React from "react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import VideoCard2 from "../../../components/wildfire/VideoCard2";
import { useUserFeed } from "../../../hooks/wildfire/useUserFeed";
import { useUserProfileByUsername } from "../../../hooks/wildfire/useUserProfileByUsername";
import { NextPage } from "next";
import { UserIcon } from "@heroicons/react/24/outline";

const Profile: NextPage = () => {
  const { username } = useParams();
  const { loading: loadingProfile, profile } = useUserProfileByUsername(username);
  const { feed, fetchMore } = useUserFeed(profile?.id);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  console.log("feed", feed);
  console.log("username", username);
  console.log("profile", profile);

  // Callback function for Intersection Observer
  const callback = (entries: any) => {
    entries.forEach((entry: any) => {
      console.log(entry.target, entry.isIntersecting);
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.getAttribute("data-index") || "0", 10);
        setPlayingIndex(index);
      }
    });
  };

  useEffect(() => {
    if (!carouselRef.current) return;

    const options = {
      root: carouselRef.current,
      rootMargin: "0px",
      threshold: 0.8, // Multiple thresholds for more accurate detection
    };

    const observer = new IntersectionObserver(callback, options);

    const videoCards = carouselRef.current.querySelectorAll(".carousel-item");

    videoCards.forEach(card => {
      observer.observe(card);
    });
  }, [feed]); // Ensure to run effect whenever feed changes

  if (profile) {
    return (
      <div className="grow w-full flex flex-row items-start ">
        {/* FEED */}
        <div ref={carouselRef} className=" carousel carousel-center w-3/4 space-x-2 rounded-lg">
          {feed && feed.length > 0 ? (
            <>
              {feed.map((video, index) => (
                <VideoCard2
                  key={index}
                  index={index}
                  author={video.profile.username}
                  videoURL={video.video_url}
                  lastVideoIndex={feed.length - 1}
                  getVideos={fetchMore}
                  isPlaying={index === playingIndex}
                />
              ))}
            </>
          ) : (
            <>Loading...</>
          )}
        </div>
        {/* PROFILE INTRO */}
        <div className="stats shadow flex flex-col grow h-full py-5 ml-2 mr-5">
          <div className="stat flex flex-col gap-2 justify-center items-center">
            <div className="stat-figure text-secondary">
              {profile.avatar_url && (
                <div className="avatar">
                  <div className="w-16 rounded-full">
                    <img src={profile.avatar_url} />
                  </div>
                </div>
              )}
              {!profile.avatar_url && (
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-24">
                    <span className="text-3xl">{profile.username.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="stat-value">{profile.username}</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-primary">
              <UserIcon width={60} />
            </div>
            <div className="stat-title">Followers</div>
            <div className="stat-value text-primary">12K</div>
            <div className="stat-desc">See followers</div>
          </div>
          {/* <div className="stat">
            <div className="stat-figure text-primary">
              <CircleStackIcon width={60} />
            </div>

            <div className="stat-title">Balance</div>
            <div className="stat-value text-primary">$350</div>
            <div className="stat-desc">See balance</div>
          </div> */}
        </div>
      </div>
    );
  } else if (loadingProfile) {
    return <>Loading</>;
  } else if (!loadingProfile && !profile) {
    return <>User Not Found</>;
  }
};

export default Profile;
