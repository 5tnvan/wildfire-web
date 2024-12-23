import React, { useRef } from "react";
import Link from "next/link";

import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

import { useOutsideClick } from "@/hooks/scaffold-eth/useOutsideClick";

import { Avatar } from "../Avatar";

const FollowingModal = ({ data, onClose }: any) => {
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
      <div
        ref={insideRef}
        className="content p-5 rounded-lg bg-base-200 w-full md:w-1/2 h-2/3 overflow-scroll relative"
      >
        <div className="flex flex-col items-center mb-2">
          <div className="font-semibold items-center">@{data.profile.username}</div>
          <div className="items-center">{data.following.length} following</div>
        </div>
        {/* FOLLOWERS SCROLL */}
        <div className="flex flex-col gap-1">
          {data.following.map((following: any, index: any) => (
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

export default FollowingModal;
