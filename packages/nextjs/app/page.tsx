"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AuthContext } from "./context";
import type { NextPage } from "next";
import { Card, Carousel } from "~~/components/ui/apple-cards-carousel";
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

  const cards = data.map((card, index) => <Card key={card.src} card={card} index={index} />);

  return (
    <>
      <Header />
      <div className="">
        {isAndroidTestModalOpen && <AndroidTestModal onClose={closeAndroidTestModal} />}
        {/* GOT 3 SECONDS? */}
        <div className="flex flex-col items-center justify-center">
          <div className="px-5 lg:mt-0 flex flex-col w-full items-center pb-0 pt-8 lg:pt-16">
            <h1 className="text-5xl font-bold">wildfire</h1>
            <h3 className="text-lg">A 3-second super dApp that pays off.</h3>
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
          {/* <Image
            src={`/app.png`}
            alt="wildfire"
            width={400}
            height={200}
            style={{ width: "auto", height: "auto" }}
            className="px-5 mb-12"
            priority
          /> */}
        </div>

        <div className="w-full h-full py-20">
          <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
            The future of 3C's:
          </h2>
          <h3 className="max-w-7xl pl-4 mx-auto text-xl font-normal text-neutral-800 dark:text-neutral-200 font-sans">
            Content & Commerce & Community
          </h3>
          <Carousel items={cards} />
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
                Boost creative problem-solving in the face of extreme limits.
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
              Looped. For. Learning.
            </h2>
            <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-black">
              No more dopamine hits — stay informed about the world, 24/7, through repetitive learning.
            </p>
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-zinc-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
            <div className="max-w-sm">
              <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-3xl font-semibold tracking-[-0.015em] text-white">
                No ads. No censorship.
              </h2>
              <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
                Just 100% you and your supporters. Decentralized.
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

        <a
          href="https://www.producthunt.com/posts/wildfire-got-3-seconds?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-wildfire&#0045;got&#0045;3&#0045;seconds"
          target="_blank"
          className="flex flex-col items-center mt-20 mb-10"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=481265&theme=neutral"
            alt="Wildfire: Got 3 Seconds? - A 3-second super dApp that pays off | Product Hunt"
            style={{ width: "250px", height: "54px" }}
            width="250"
            height="54"
          />
        </a>
      </div>
      <Footer />
    </>
  );
};

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div key={"dummy-content" + index} className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                The first rule of Apple club is that you boast about Apple club.
              </span>{" "}
              Keep a journal, quickly jot down a grocery list, and take amazing class notes. Want to convert those notes
              to text? No problem. Langotiya jeetu ka mara hua yaar is ready to capture every thought.
            </p>
            <Image
              src="https://assets.aceternity.com/macbook.png"
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
            />
          </div>
        );
      })}
    </>
  );
};

const data = [
  {
    category: "Content",
    title: "3 seconds a day.",
    src: "https://images.unsplash.com/photo-1719937206930-84afb0daf141?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Storytelling",
    title: "Stitched into a story.",
    src: "/ezgif-4-e1d7762367.gif",
    content: <DummyContent />,
  },
  {
    category: "Audience",
    title: "Grow with Gen Z and Alpha.",
    src: "/premium_photo-1687989651281-d9dfee04ec74.png",
    content: <DummyContent />,
  },
  {
    category: "E-commerce",
    title: "Your store accepts crypto.",
    src: "https://images.unsplash.com/photo-1599202875854-23b7cd490ff4?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Community",
    title: "Go beyond virtual.",
    src: "/ezgif-3-489a4dc383.gif",
    content: <DummyContent />,
  },
];

export default Landing;
