"use client";

import { useContext } from "react";
import { NextPage } from "next";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "~~/app/context";
import { Avatar } from "~~/components/Avatar";
import { useCreators } from "~~/hooks/wildfire/useCreators";
import { insertFollow } from "~~/utils/wildfire/crud/followers";

const Creators: NextPage = () => {
  const { user } = useContext(AuthContext);
  const { loading: loadingFeed, feed, fetchMore } = useCreators(9);

  const handleFollow = async (profile_id: any, event: any) => {
    const button = event.currentTarget;
    button.innerHTML = "Following";
    button.classList.remove("btn-outline");
    button.classList.add("btn-primary");
    await insertFollow(user.id, profile_id);
  };

  return (
    <div id="creator-page" className="h-screen-custom overflow-scroll p-2">
      <div className="grid grid-cols-12 gap-2">
        {feed.map((profile: any, index: any) => {
          return (
            <div
              key={index}
              className="col-span-12 md:col-span-6 lg:col-span-3 w-full h-52 rounded-lg bg-base-100"
            >
              <div className="relative bg-gradient-to-r from-violet-600 to-indigo-600 h-1/3 rounded-lg">
                <div className="absolute left-2" style={{ bottom: -20 }}>
                  <Avatar profile={profile} width={10} height={10} />
                </div>
              </div>
              <div className="mt-6 p-2">
                <a href={`/${profile.username}`} className="block font-bold mb-2">
                  @{profile.username}
                </a>
                <div className="">
                  {profile.isFollowed ? (
                    <a href={`/${profile.username}`} className="btn btn-primary relative w-1/2">
                      <span>Connected</span>
                      {/* <CheckCircleIcon width={18} className="absolute right-3" /> */}
                    </a>
                  ) : (
                    <div className="btn btn-outline w-1/2" onClick={event => handleFollow(profile.id, event)}>
                      Connect
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {loadingFeed && <div className="flex flex-row justify-evenly items-end my-5">
          <div className="grow flex flex-row justify-center">
            <span className="loading loading-dots loading-sm"></span>
          </div>
        </div>}
      </div>
      <div
        className="btn relative flex flex-row items-center justify-center mt-2 border-b-2 pb- cursor-pointer mb-2"
        onClick={() => fetchMore()}
      >
        <ArrowDownCircleIcon width={30} />
      </div>
    </div>
  );
};

export default Creators;
