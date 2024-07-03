"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AuthContext } from "./context";
import type { NextPage } from "next";
import { WobbleCard } from "~~/components/ui/wooble-card";
import AndroidTestModal from "~~/components/wildfire/AndroidTestModal";
import { Footer } from "~~/components/wildfire/Footer";
import { Header } from "~~/components/wildfire/Header";

const Landing: NextPage = () => {
  const { isAuthenticated } = useContext(AuthContext);

  //TIP MODAL
  const [isAndroidTestModalOpen, setAndroidTestModalOpen] = useState(false);

  const closeAndroidTestModal = () => {
    setAndroidTestModalOpen(false);
  };

  return (
    <>
      <Header />
      <div className="">
        {isAndroidTestModalOpen && <AndroidTestModal onClose={closeAndroidTestModal} />}
        {/* GOT 3 SECONDS? */}
        <div className="flex flex-col items-center justify-center">
          <div className="px-5 lg:mt-0 flex flex-col w-full items-center pb-0 pt-8 lg:pt-16">
            <h1 className="text-5xl font-bold">wildfire</h1>
            <h3 className="text-lg">A 3 seconds video-sharing app that pays off</h3>
            {isAuthenticated && (
              <Link href="/feed" className="btn btn-outline text-base">
                Launch App
              </Link>
            )}
            {!isAuthenticated && (
              <Link href="/preview" className="btn btn-outline text-base">
                Watch Preview
              </Link>
            )}
          </div>
          {/* GET THE APP ON */}
          <div className="w-full rounded-lg m-auto py-10">
            <div className="flex flex-col md:flex-row justify-center items-center md:gap-4">
              <Link
                href="https://apps.apple.com/us/app/wildfire-3-seconds-app/id6503965553"
                target="new"
                className="flex items-center justify-center w-48 mt-3 text-white bg-black h-14 rounded-xl border border-zinc-500"
              >
                <div className="mr-3">
                  <svg viewBox="0 0 384 512" width="30">
                    <path
                      fill="currentColor"
                      d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="-mt-1 font-sans text-xl font-semibold">App Store</div>
                </div>
              </Link>
              <Link
                href="/"
                onClick={() => setAndroidTestModalOpen(true)}
                type="button"
                className="flex items-center justify-center w-48 mt-3 text-white bg-black rounded-lg h-14 border border-zinc-500"
              >
                <div className="mr-3">
                  <svg viewBox="30 336.7 120.9 129.2" width="30">
                    <path
                      fill="#FFD400"
                      d="M119.2,421.2c15.3-8.4,27-14.8,28-15.3c3.2-1.7,6.5-6.2,0-9.7  c-2.1-1.1-13.4-7.3-28-15.3l-20.1,20.2L119.2,421.2z"
                    ></path>
                    <path
                      fill="#FF3333"
                      d="M99.1,401.1l-64.2,64.7c1.5,0.2,3.2-0.2,5.2-1.3  c4.2-2.3,48.8-26.7,79.1-43.3L99.1,401.1L99.1,401.1z"
                    ></path>
                    <path
                      fill="#48FF48"
                      d="M99.1,401.1l20.1-20.2c0,0-74.6-40.7-79.1-43.1  c-1.7-1-3.6-1.3-5.3-1L99.1,401.1z"
                    ></path>
                    <path
                      fill="#3BCCFF"
                      d="M99.1,401.1l-64.3-64.3c-2.6,0.6-4.8,2.9-4.8,7.6  c0,7.5,0,107.5,0,113.8c0,4.3,1.7,7.4,4.9,7.7L99.1,401.1z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <div className="text-xs">GET IT ON</div>
                  <div className="-mt-1 font-sans text-xl font-semibold">Google Play</div>
                </div>
              </Link>
            </div>
          </div>
          <Image
            src={`/app.png`}
            alt="wildfire"
            width={400}
            height={200}
            style={{ width: "auto", height: "auto" }}
            className="px-5 mb-12"
            priority
          />
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
              <p className="mt-4 text-left  text-base/6 text-neutral-200 text-shadow">
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
      <Footer />
    </>
  );
};

export default Landing;
