"use client";

import { useContext } from "react";
import { NextPage } from "next";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "~~/app/context";
import { Avatar } from "~~/components/Avatar";
import { useCreators } from "~~/hooks/wildfire/useCreators";
import { useGlobalState } from "~~/services/store/store";
import { calculateSum } from "~~/utils/wildfire/calculateSum";
import { convertEthToUsd } from "~~/utils/wildfire/convertEthToUsd";
import { insertFollow } from "~~/utils/wildfire/crud/followers";

const Creators: NextPage = () => {
  const { user } = useContext(AuthContext);
  const { loading: loadingFeed, feed, refetch } = useCreators();
  const price = useGlobalState(state => state.nativeCurrency.price);

  const handleFollow = async (profile_id: any, event: any) => {
    const button = event.currentTarget;
    button.innerHTML = "Following";
    button.classList.remove("btn-outline");
    button.classList.add("btn-primary");
    const error = await insertFollow(user.id, profile_id);
    if (error) {
      console.log("error", error);
    }
  };

  if (loadingFeed) {
    return (
      <div className="flex flex-row justify-center items-center grow">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  return (
    <div id="creator-page" className="h-screen-custom overflow-scroll p-2">
      <div className="grid grid-cols-12 gap-2">
        {feed.map((profile: any) => {
          // Calculate ETH sum and convert to USD if data is available
          const ethereumSum = profile.ethereumData?.paymentChanges ? calculateSum(profile.ethereumData) : 0;
          const baseSum = profile.baseData?.paymentChanges ? calculateSum(profile.baseData) : 0;
          const totalEth = ethereumSum + baseSum;
          const totalUsd = totalEth ? convertEthToUsd(totalEth, price) : 0;

          return (
            <div
              key={profile.id}
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
                      <span>Following</span>
                      {/* <CheckCircleIcon width={18} className="absolute right-3" /> */}
                    </a>
                  ) : (
                    <div className="btn btn-outline w-1/2" onClick={event => handleFollow(profile.id, event)}>
                      Follow
                    </div>
                  )}
                  {(profile.ethereumData?.paymentChanges?.length > 0 ||
                    profile.baseData?.paymentChanges?.length > 0) && (
                    <div className="btn btn-square w-1/2">{`$${totalUsd.toFixed(2)}`}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div onClick={refetch} className="btn mt-2 bg-base-300 flex flex-row w-full">
        <ArrowPathIcon width={18} />
      </div>
    </div>
  );
};

export default Creators;
