import React, { useRef, useState } from "react";
import Link from "next/link";
import { Avatar } from "../Avatar";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useOutsideClick } from "~~/hooks/scaffold-eth/useOutsideClick";

const KinsModal = ({ data, onClose }: any) => {
  const [activeTab, setActiveTab] = useState<"followers" | "following">("followers");
  const insideRef = useRef<any>(null);

  useOutsideClick(insideRef, () => {
    handleClose();
  });

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div onClick={handleClose} className="btn bg-white hover:bg-white text-black self-start absolute left-2 top-2">
        <ChevronLeftIcon width={20} color="black" />
        Back
      </div>
      <div ref={insideRef} className="content p-5 rounded-lg bg-base-200 w-full md:w-1/2 h-2/3 overflow-scroll relative">
        <div className="flex flex-col items-center mb-4">
          <div className="font-semibold items-center">@{data.posterProfile?.username}</div>
          <div className="font-normal items-center">{data.followers?.length + data.following?.length} kins</div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-300 mb-4">
          <button
            onClick={() => setActiveTab("followers")}
            className={`flex-1 py-2 text-center ${
              activeTab === "followers" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"
            }`}
          >
            Incoming ({data.followers.length})
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`flex-1 py-2 text-center ${
              activeTab === "following" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"
            }`}
          >
            Outgoing ({data.following.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1">
          {activeTab === "followers" &&
            data.followers?.map((follower: any, index: any) => (
              <Link
                key={index}
                href={"/" + follower.follower.username}
                className="btn bg-base-100 flex flex-row items-center justify-between w-full"
              >
                <div className="flex flex-row items-center">
                  <Avatar profile={follower.follower} width={8} height={8} />
                  <div className="text-base ml-4">{follower.follower.username}</div>
                </div>
                <ChevronRightIcon width={10} />
              </Link>
            ))}

          {activeTab === "following" &&
            data.following?.map((following: any, index: any) => (
              <Link
                key={index}
                href={"/" + following.following.username}
                className="btn bg-base-100 flex flex-row items-center justify-between w-full"
              >
                <div className="flex flex-row items-center">
                  <Avatar profile={following.following} width={8} height={8} />
                  <div className="text-base ml-4">{following.following.username}</div>
                </div>
                <ChevronRightIcon width={10} />
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default KinsModal;
