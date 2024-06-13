"use client";

import { useContext } from "react";
import React from "react";
import Link from "next/link";
import { AuthUserContext, AuthUserFollowsContext } from "../../context";
import { NextPage } from "next";
import { CircleStackIcon, UserIcon } from "@heroicons/react/24/outline";
import FormatNumber from "~~/components/wildfire/FormatNumber";
import ThumbCard from "~~/components/wildfire/ThumCard";
import { useIncomingTransactions } from "~~/hooks/wildfire/useIncomingTransactions";
import { useUserFeedAll } from "~~/hooks/wildfire/useUserFeedAll";
import { calculateSum } from "~~/utils/wildfire/calculateSum";

const Profile: NextPage = () => {
  //CONSUME PROVIDERS
  const { profile } = useContext(AuthUserContext);
  const { following } = useContext(AuthUserFollowsContext);

  //FETCH DIRECTLY
  const incomingRes = useIncomingTransactions(profile?.wallet_id);

  console.log;

  //DYNAMICALLY GENERATE LEVEL NAME
  const highestLevel = profile?.levels.reduce((max: number, item: any) => (item.level > max ? item.level : max), 0);
  const levelNames = ["noob", "creator", "builder", "architect", "visionary", "god-mode"];
  const levelName = levelNames[highestLevel] || "unknown";
  const balance = (calculateSum(incomingRes.ethereumData) + calculateSum(incomingRes.baseData)).toFixed(3);

  //FETCH DIRECTLY
  const { feed } = useUserFeedAll();

  console.log("profile", profile);
  console.log("profile", levelName);

  return (
    <div className="flex flex-row items-start ">
      <div className="carousel carousel-center rounded-box w-full ml-2">
        {feed && feed.length > 0 ? (
          <>
            {feed.map((thumb: any, index: any) => (
              <ThumbCard key={index} index={index} data={thumb} />
            ))}
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="stats shadow flex flex-col grow w-[350px] h-full py-5 mx-2">
        <div className="stat">
          <div className="stat-figure text-secondary">
            {profile?.avatar_url && (
              <div className="avatar">
                <div className="w-16 rounded-full">
                  <img src={profile?.avatar_url} />
                </div>
              </div>
            )}
            {!profile?.avatar_url && (
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-24">
                  <span className="text-3xl">{profile?.username.charAt(0).toUpperCase()}</span>
                </div>
              </div>
            )}
          </div>
          <div className="stat-title">Level</div>
          <div className="stat-value">{levelName}</div>
          {/* <div className="stat-desc">Level up</div> */}
        </div>
        <div className="stat">
          <div className="stat-figure text-primary">
            <UserIcon width={60} />
          </div>
          <div className="stat-title">Followers</div>
          <div className="stat-value text-primary">
            {following && following.length > 0 ? <FormatNumber number={following.length} /> : "s0"}
          </div>
          <div className="stat-desc">See followers</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-primary">
            <CircleStackIcon width={60} />
          </div>

          <div className="stat-title">Balance</div>
          <div className="stat-value text-primary">{balance}</div>
          <Link href={"https://www.wildpay.app/" + profile?.username} className="stat-desc">
            See history
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
