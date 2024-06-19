"use client";

import Image from "next/image";
import { Avatar } from "../Avatar";
import FormatNumber from "../wildfire/FormatNumber";
import { TimeAgo } from "../wildfire/TimeAgo";
import { EyeIcon } from "@heroicons/react/24/outline";

export const ParallaxScrollItem = ({ data }: any) => {
  return (
    <>
      {/* WATCH COUNT */}
      <div className="absolute right-0 px-2 m-2 bg-white text-black flex flex-row gap-1 rounded-full">
        <EyeIcon width={20} />
        <span className="font-medium">
          <FormatNumber number={data["3sec_views"][0].view_count} />
        </span>
      </div>
      <Image
        src={data.thumbnail_url}
        className="h-90 w-full object-cover object-left-top rounded-lg gap-2 !m-0 !p-0"
        height={960}
        width={540}
        alt={data.profile.username}
      />
      {/* AVATAR */}
      <div className="absolute top-2 left-2">
        <Avatar profile={data.profile} width={10} height={10} />
      </div>
      {/* STRIP */}
      <div className="absolute bottom-0 w-full flex flex-row p-4 bg-base-200 bg-opacity-90 justify-between items-center">
        <div>
          <span className="font-semibold text-sm">{data.country && data.country.name}</span>
          <span className="text-sm">
            <TimeAgo timestamp={data.created_at} />
          </span>
        </div>
        <Image
          src={`/wildfire-logo-lit.png`}
          alt="hero"
          height={120}
          width={120}
          className=""
          draggable={false}
          style={{ width: "70px", height: "auto" }}
        />
      </div>
    </>
  );
};
