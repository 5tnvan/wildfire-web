"use client";

import { useRef } from "react";
import Image from "next/image";
import { Avatar } from "../Avatar";
import FormatNumber from "../wildfire/FormatNumber";
import { TimeAgo } from "../wildfire/TimeAgo";
import { useScroll, useTransform } from "framer-motion";
import { motion } from "framer-motion";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import { EyeIcon, FireIcon } from "@heroicons/react/24/solid";
import { PlayIcon } from "@heroicons/react/24/solid";
import { cn } from "~~/utils/cn";

export const ParallaxScroll = ({ data, onCta }: any) => {
  const gridRef = useRef(null);

  const { scrollYProgress } = useScroll({
    container: gridRef,
    offset: ["start start", "end start"],
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const third = Math.ceil(data.length / 3);

  const firstPart = data.slice(0, third);
  const secondPart = data.slice(third, 2 * third);
  const thirdPart = data.slice(2 * third);

  return (
    <div className={cn("h-screen-custom items-start overflow-y-auto w-full")} ref={gridRef}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-2 px-2" ref={gridRef}>
        <div className="grid gap-2">
          {firstPart.map((item: any) => (
            <motion.div
              style={{ y: translateFirst }}
              key={`grid-1-${item.id}`}
              className="relative bg-black hover:opacity-85 cursor-pointer rounded-lg"
              onClick={() => {
                onCta(item.id);
              }}
            >
              {/* PLAY ICON */}
              <div className="absolute right-1/2 h-full flex justify-center bg-opacity-90">
                <PlayIcon width={48} className="" color="white" />
              </div>
              {/* WATCH COUNT */}
              <div className="absolute right-0 px-2 m-2 bg-white text-black flex flex-row gap-1 rounded-full">
                <EyeIcon width={20} />
                <span className="font-medium">
                  <FormatNumber number={item["3sec_views"][0].view_count} />
                </span>
              </div>
              <Image
                src={item.thumbnail_url}
                className="h-90 w-full object-cover object-left-top rounded-lg gap-2 !m-0 !p-0 opacity-50"
                height={960}
                width={540}
                alt={item.profile.username}
              />
              {/* AVATAR */}
              <div className="absolute top-2 left-2">
                <Avatar profile={item.profile} width={10} height={10} />
              </div>
              {/* STRIP */}
              <div className="absolute bottom-0 w-full flex flex-row p-4 bg-base-200 bg-opacity-90 justify-between items-center">
                <div>
                  <span className="font-semibold text-sm">{item.country && item.country.name}</span>
                  <span className="text-sm">
                    <TimeAgo timestamp={item.created_at} />
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
            </motion.div>
          ))}
        </div>
        <div className="grid gap-2">
          {secondPart.map((item: any) => (
            <motion.div
              style={{ y: translateSecond }}
              key={`grid-2-${item.id}`}
              className="relative bg-black hover:opacity-85 cursor-pointer rounded-lg"
              onClick={() => onCta(item.id)}
            >
              {/* PLAY ICON */}
              <div className="absolute right-1/2 h-full flex justify-center bg-opacity-90">
                <PlayIcon width={48} className="" color="white" />
              </div>
              {/* WATCH COUNT */}
              <div className="absolute right-0 px-2 m-2 bg-white text-black flex flex-row gap-1 rounded-full">
                <EyeIcon width={20} />
                <span className="font-medium">
                  <FormatNumber number={item["3sec_views"][0].view_count} />
                </span>
              </div>
              <Image
                src={item.thumbnail_url}
                className="h-90 w-full object-cover object-left-top rounded-lg gap-2 !m-0 !p-0 opacity-50"
                height={960}
                width={540}
                alt={item.profile.username}
              />
              {/* AVATAR */}
              <div className="absolute top-2 left-2">
                <Avatar profile={item.profile} width={10} height={10} />
              </div>
              {/* STRIP */}
              <div className="absolute bottom-0 w-full flex flex-row p-4 bg-base-200 bg-opacity-90 justify-between items-center">
                <div>
                  <span className="font-semibold text-sm">{item.country && item.country.name}</span>
                  <span className="text-sm">
                    <TimeAgo timestamp={item.created_at} />
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
            </motion.div>
          ))}
        </div>
        <div className="grid gap-2">
          {thirdPart.map((item: any) => (
            <motion.div
              style={{ y: translateThird }}
              key={`grid-3-${item.id}`}
              className="relative"
              onClick={() => onCta(item.id)}
            >
              {/* PLAY ICON */}
              <div className="absolute right-1/2 h-full flex justify-center bg-opacity-90">
                <PlayIcon width={48} className="" color="white" />
              </div>
              {/* WATCH COUNT */}
              <div className="absolute right-0 px-2 m-2 bg-white text-black flex flex-row gap-1 rounded-full">
                <EyeIcon width={20} />
                <span className="font-medium">
                  <FormatNumber number={item["3sec_views"][0].view_count} />
                </span>
              </div>
              <Image
                src={item.thumbnail_url}
                className="h-90 w-full object-cover object-left-top rounded-lg gap-2 !m-0 !p-0 opacity-50"
                height={960}
                width={540}
                alt={item.profile.username}
              />
              {/* AVATAR */}
              <div className="absolute top-2 left-2">
                <Avatar profile={item.profile} width={10} height={10} />
              </div>
              {/* STRIP */}
              <div className="absolute bottom-0 w-full flex flex-row p-4 bg-base-200 bg-opacity-90 justify-between items-center">
                <div>
                  <span className="font-semibold text-sm">{item.country && item.country.name}</span>
                  <span className="text-sm">
                    <TimeAgo timestamp={item.created_at} />
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
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
