"use client";

import { useRef } from "react";
import Image from "next/image";
import { Avatar } from "../Avatar";
import FormatNumber from "../wildfire/FormatNumber";
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
              className="relative"
              onClick={() => {
                onCta(item.id);
              }}
            >
              <Image
                src={item.thumbnail_url}
                className="h-90 w-full object-cover object-left-top rounded-lg gap-2 !m-0 !p-0"
                height={960}
                width={540}
                alt={item.profile.username}
              />
              <div className="absolute top-2 left-2">
                <Avatar profile={item.profile} width={10} height={10} />
              </div>
              <div className="absolute top-3 right-2">
                <PlayIcon width={35} color="white" className="" />
              </div>
              <div className="absolute bottom-4 right-2 flex flex-col gap-2">
                <div className="flex flex-col items-center">
                  <FireIcon width={28} color="white" />
                  <span className="text-base font-medium text-white text-shadow">
                    <FormatNumber number={item["3sec_fires"][0]?.count} />
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <ChatBubbleOvalLeftEllipsisIcon width={28} color="white" />
                  <span className="text-base font-medium text-white text-shadow">
                    <FormatNumber number={item["3sec_comments"].length} />
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <EyeIcon width={26} color="white" />
                  <span className="text-base font-medium text-white text-shadow">
                    <FormatNumber number={item["3sec_views"][0]?.view_count} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="grid gap-2">
          {secondPart.map((item: any) => (
            <motion.div
              style={{ y: translateSecond }}
              key={`grid-2-${item.id}`}
              className="relative"
              onClick={() => onCta(item.id)}
            >
              <Image
                src={item.thumbnail_url}
                className="h-90 w-full object-cover object-left-top rounded-lg gap-2 !m-0 !p-0"
                height={960}
                width={540}
                alt={item.profile.username}
              />
              <div className="absolute top-2 left-2">
                <Avatar profile={item.profile} width={10} height={10} />
              </div>
              <div className="absolute top-3 right-2">
                <PlayIcon width={35} color="white" className="" />
              </div>
              <div className="absolute bottom-4 right-2 flex flex-col gap-2">
                <div className="flex flex-col items-center">
                  <FireIcon width={28} color="white" />
                  <span className="text-base font-medium text-white text-shadow">
                    <FormatNumber number={item["3sec_fires"][0]?.count} />
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <ChatBubbleOvalLeftEllipsisIcon width={28} color="white" />
                  <span className="text-base font-medium text-white text-shadow">
                    <FormatNumber number={item["3sec_comments"].length} />
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <EyeIcon width={28} color="white" />
                  <span className="text-base font-medium text-white text-shadow">
                    <FormatNumber number={item["3sec_views"][0]?.view_count} />
                  </span>
                </div>
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
              <Image
                src={item.thumbnail_url}
                className="h-90 w-full object-cover object-left-top rounded-lg gap-2 !m-0 !p-0"
                height={960}
                width={540}
                alt={item.profile.username}
              />
              <div className="absolute top-2 left-2">
                <Avatar profile={item.profile} width={10} height={10} />
              </div>
              <div className="absolute top-3 right-2">
                <PlayIcon width={35} color="white" className="" />
              </div>
              <div className="absolute bottom-4 right-2 flex flex-col gap-2">
                <div className="flex flex-col items-center">
                  <FireIcon width={28} color="white" />
                  <span className="text-base font-medium text-white text-shadow">
                    <FormatNumber number={item["3sec_fires"][0]?.count} />
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <ChatBubbleOvalLeftEllipsisIcon width={28} color="white" />
                  <span className="text-base font-medium text-white text-shadow">
                    <FormatNumber number={item["3sec_comments"].length} />
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <EyeIcon width={28} color="white" />
                  <span className="text-base font-medium text-white text-shadow">
                    <FormatNumber number={item["3sec_views"][0]?.view_count} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
