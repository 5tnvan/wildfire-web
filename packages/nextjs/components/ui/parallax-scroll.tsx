"use client";

import { useEffect, useRef } from "react";
import { ParallaxScrollItem } from "../wildfire/ParallaxScrollItem";
import { useScroll, useTransform } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "~~/utils/cn";

export const ParallaxScroll = ({ data, onCta, fetchMore }: any) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const lastItemId = data[data.length - 1]?.id;

  //parallax scroll
  const { scrollYProgress } = useScroll({
    container: gridRef,
    offset: ["start start", "end start"],
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const firstPart = data.filter((_: any, index: number) => index % 3 === 0);
  const secondPart = data.filter((_: any, index: number) => index % 3 === 1);
  const thirdPart = data.filter((_: any, index: number) => index % 3 === 2);

  // Callback function for Intersection Observer
  const callback = (entries: any) => {
    entries.forEach((entry: any) => {
      //console.log(entry.target, entry.isIntersecting);
      if (entry.isIntersecting) {
        const index = entry.target.getAttribute("data-index");
        //console.log("lastItemId", lastItemId);
        //console.log("index", index);
        if (index === lastItemId) {
          fetchMore();
        }
      }
    });
  };

  useEffect(() => {
    if (!gridRef.current) return;

    const options = {
      root: gridRef.current,
      rootMargin: "0px",
      threshold: 0.8, // Multiple thresholds for more accurate detection
    };

    const observer = new IntersectionObserver(callback, options);

    const videoCards = gridRef.current.querySelectorAll(".grid-item");

    videoCards.forEach(card => {
      observer.observe(card);
    });
  }, [data]); // Ensure to run effect whenever feed changes

  return (
    <div className={cn("h-screen-custom items-start overflow-y-auto w-full grow")} ref={gridRef}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-2 px-2">
        <div className="grid gap-2">
          {firstPart.map((item: any) => (
            <motion.div
              data-index={item.id}
              style={{ y: translateFirst }}
              key={`grid-1-${item.id}`}
              className="grid-item relative bg-black hover:opacity-85 cursor-pointer rounded-lg"
              onClick={() => {
                onCta(item.id);
              }}
            >
              <ParallaxScrollItem data={item} />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-2">
          {secondPart.map((item: any) => (
            <motion.div
              data-index={item.id}
              style={{ y: translateSecond }}
              key={`grid-2-${item.id}`}
              className="grid-item relative bg-black hover:opacity-85 cursor-pointer rounded-lg"
              onClick={() => onCta(item.id)}
            >
              <ParallaxScrollItem data={item} />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-2">
          {thirdPart.map((item: any) => (
            <motion.div
              data-index={item.id}
              style={{ y: translateThird }}
              key={`grid-3-${item.id}`}
              className="grid-item relative bg-black hover:opacity-85 cursor-pointer rounded-lg"
              onClick={() => onCta(item.id)}
            >
              <ParallaxScrollItem data={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
