"use client";

import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { WobbleCard } from "~~/components/ui/wooble-card";

const Home: NextPage = () => {
  return (
    <>
      <div className="">
        {/* GOT 3 SECONDS? */}
        <div className="flex flex-col items-center justify-center">
          <div className="px-5 lg:mt-0 flex flex-col w-full items-center py-8 lg:py-16">
            <h1 className="text-5xl font-bold">wildfire</h1>
            <h3 className="text-lg">A 3 seconds video app that pays off</h3>
            <Link
              href="https://youtube.com/clip/UgkxjdMK-9RyykIG7JHpuWkTQX4h8w7Mlbr6?si=UsxzkYpD2LuV91O8"
              className="btn btn-outline text-base"
            >
              Watch Preview
            </Link>
          </div>
          <Image
            src={`/app.png`}
            alt="wildfire"
            width={400}
            height={200}
            style={{ width: "auto", height: "auto" }}
            className="px-5"
            priority
          />
        </div>

        {/* WE ARE WORKING HARD TO GET THE APP ON */}
        <div className="p-20 w-full rounded-lg m-auto">
          <h1 className="text-lg text-center text-content-primary mb-5">Get the app soon.</h1>
          <div className="flex flex-col lg:flex-row justify-center gap-4">
            <Image
              src={`/applestore.png`}
              alt="wildfire"
              height={900}
              width={220}
              className="rounded-2xl object-cover h-full"
              style={{ width: "auto", height: "auto" }}
              draggable={false}
            />
            <Image
              src={`/googleplay.png`}
              alt="wildfire"
              height={900}
              width={200}
              className="rounded-2xl object-cover h-full object-left-top"
              style={{ width: "auto", height: "auto" }}
              draggable={false}
            />
          </div>
        </div>

        {/* 3-GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 max-w-7xl mx-auto w-full ">
          <WobbleCard
            containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
            className=""
          >
            <div className="max-w-xs">
              <h2 className="text-left text-balance text-3xl font-semibold tracking-[-0.015em] text-white">
                Got 3 seconds?
              </h2>
              <p className="mt-4 text-left  text-base/6 text-neutral-200">
                Become a Web3 Creator by posting a 3-second video each day.
              </p>
            </div>
            <Image
              src="/3-pink.png"
              width={200}
              height={200}
              alt="linear demo image"
              className="absolute right-3 grayscale filter -bottom-10 object-contain rounded-2xl"
              style={{ width: "auto", height: "auto" }}
            />
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 bg-primary min-h-[300px]">
            <h2 className="max-w-80  text-left text-balance text-3xl font-semibold tracking-[-0.015em] text-black">
              Extremely. Short. Content.
            </h2>
            <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-black">
              No more doom scrolling—stay informed about the world, 24/7, in just 3 seconds.
            </p>
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-zinc-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
            <div className="max-w-sm">
              <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-3xl font-semibold tracking-[-0.015em] text-white">
                Web3 pays 100%.
              </h2>
              <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
                Creators get paid instantly, and retain all their revenue.
              </p>
            </div>
            <Image
              src="/100.png"
              width={800}
              height={800}
              alt="linear demo image"
              className="absolute right-3 grayscale filter bottom-0 object-contain rounded-2xl"
              style={{ width: "auto", height: "auto" }}
            />
          </WobbleCard>
        </div>
      </div>
    </>
  );
};

export default Home;
