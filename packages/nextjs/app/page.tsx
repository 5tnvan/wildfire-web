"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext, AuthUserFollowsContext } from "./context";
import { motion } from "framer-motion";
import type { NextPage } from "next";
import { useTheme } from "next-themes";
import { Card, Carousel } from "~~/components/ui/apple-cards-carousel";
import { Lens } from "~~/components/ui/lens";
import { WobbleCard } from "~~/components/ui/wooble-card";
import AndroidTestModal from "~~/components/wildfire/AndroidTestModal";
import { Footer } from "~~/components/wildfire/Footer";
import { Header } from "~~/components/wildfire/Header";
import { cn } from "~~/utils/cn";

const Landing: NextPage = () => {
  const router = useRouter();
  const { resolvedTheme } = useTheme(); // Get the current theme
  const isDarkMode = resolvedTheme === "dark"; // Check if dark mode is active
  const { isAuthenticated } = useContext(AuthContext);
  const { refetchAuthUserFollows } = useContext(AuthUserFollowsContext);
  const [hovering, setHovering] = useState(false);

  //TIP MODAL
  const [isAndroidTestModalOpen, setAndroidTestModalOpen] = useState(false);

  const closeAndroidTestModal = () => {
    setAndroidTestModalOpen(false);
  };

  const cards = data.map((card, index) => <Card key={card.src} card={card} index={index} />);

  if (isAuthenticated) {
    router.push("/feed");
    refetchAuthUserFollows();
  }

  return (
    <>
      <Header />
      <div className="">
        {isAndroidTestModalOpen && <AndroidTestModal onClose={closeAndroidTestModal} />}
        {/* GOT 3 SECONDS? */}
        <div className="flex flex-col items-center justify-center">
          <div className="px-5 lg:mt-0 flex flex-col w-full items-center pb-0 pt-8 lg:pt-16">
            <h1 className="text-5xl font-bold">Open Video.</h1>
            <h1 className="text-5xl font-bold">Freedom to Express.</h1>
            <h2 className="text-lg mt-5 mb-5">
              Earn <span className="text-blue-500 font-semibold">$ETH</span> &{" "}
              <span className="text-blue-500 font-semibold">$FUSE</span> rewards.
            </h2>
            {isAuthenticated && (
              <Link href="/feed" className="btn btn-primary text-base">
                Launch App
              </Link>
            )}
            {!isAuthenticated && (
              <Link href="/login" className="btn btn-primary text-base">
                Launch App
              </Link>
            )}
            <div className="lg:flex lg:flex-row lg:gap-12 mt-10">
              <div className="w-full relative rounded-3xl overflow-hidden max-w-md mx-auto bg-gradient-to-r from-[#1D2235] to-[#121318] p-8 my-10">
                <Rays />
                <Beams />
                <div className="relative z-10">
                  <Lens hovering={hovering} setHovering={setHovering}>
                    <div className="w-full h-60">
                      <Image
                        src="/premium_photo-1687989651281-d9dfee04ec74.png"
                        alt="image"
                        width={500}
                        height={500}
                        className="rounded-2xl"
                      />
                    </div>
                  </Lens>
                  <motion.div
                    animate={{
                      filter: hovering ? "blur(2px)" : "blur(0px)",
                    }}
                    className="py-4 relative z-20"
                  >
                    <div className="flex flex-row items-center justify-between">
                      <h2 className="text-white text-2xl text-left font-bold mb-0">Tell a story</h2>
                      <p className="text-primary">3 - 15 seconds</p>
                    </div>
                    <p className="text-neutral-200 text-left  mt-4">
                      Capture a moment a day and let your story unleash.
                    </p>
                    {isAuthenticated && (
                      <Link href="/feed" className="btn text-base">
                        Launch App
                      </Link>
                    )}
                    {!isAuthenticated && (
                      <Link href="/login" className="btn text-base">
                        Watch shorts
                      </Link>
                    )}
                  </motion.div>
                </div>
              </div>
              <div className="w-full relative rounded-3xl overflow-hidden max-w-md mx-auto bg-gradient-to-r from-[#1D2235] to-[#121318] p-8 my-10">
                <Rays />
                <Beams />
                <div className="relative z-10">
                  <Lens hovering={hovering} setHovering={setHovering}>
                    <div className="w-full h-60">
                      <Image
                        src="/ezgif-3-489a4dc383.gif"
                        alt="image"
                        width={500}
                        height={500}
                        className="rounded-2xl"
                      />
                    </div>
                  </Lens>
                  <motion.div
                    animate={{
                      filter: hovering ? "blur(2px)" : "blur(0px)",
                    }}
                    className="py-4 relative z-20"
                  >
                    <div className="flex flex-row items-center justify-between">
                      <h2 className="text-white text-2xl text-left font-bold mb-0">Spark a revolution</h2>
                      <p className="text-primary">15 mins</p>
                    </div>
                    <p className="text-neutral-200 text-left mt-4">From an idea to a revolution. Speak your passion.</p>
                    {isAuthenticated && (
                      <Link href="/feed" className="btn text-base">
                        Launch App
                      </Link>
                    )}
                    {!isAuthenticated && (
                      <Link href="/login" className="btn text-base">
                        Watch videos
                      </Link>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
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

        {/* Ecosystem */}
        <div className="flex flex-col items-center mb-24">
          <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
            Powered by
          </h2>
          <div className="flex flex-col flex-wrap md:flex-row justify-center items-center gap-20">
            <Link href="https://www.kinnectwallet.com/" target="_blank" className="mt-8 mb-2 self-center">
              <Image
                src={isDarkMode ? `/kinnect/kinnect-full-logo-white.svg` : `/kinnect/kinnect-full-logo-blue.svg`} // Change image based on theme
                alt="hero"
                height={600}
                width={200}
                className=""
                draggable={false}
                style={{ width: "300px", height: "auto" }}
              />
            </Link>
            <Link href="https://www.livepeer.org/" target="_blank" className="mt-8 mb-2 self-center">
              <Image
                src={isDarkMode ? `/livepeer/Livepeer-Logo-Full-Light.svg` : `/livepeer/Livepeer-Logo-Full-Dark.svg`} // Change image based on theme
                alt="hero"
                height={600}
                width={200}
                className=""
                draggable={false}
                style={{ width: "300px", height: "auto" }}
              />
            </Link>
            <Link href="https://www.fuse.io/" target="_blank" className="mt-8 mb-2 self-center">
              <Image
                src={isDarkMode ? `/fuse/fuse-white.svg` : `/fuse/fuse-dark.svg`} // Change image based on theme
                alt="hero"
                height={600}
                width={200}
                className=""
                draggable={false}
                style={{ width: "200px", height: "auto" }}
              />
            </Link>
          </div>
          <div className="flex flex-col md:flex-row justify-center"></div>
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
    category: "Capture",
    title: "A moment, every day.",
    src: "https://images.unsplash.com/photo-1719937206930-84afb0daf141?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Storytelling",
    title: "Unleash your story.",
    src: "/ezgif-4-e1d7762367.gif",
    content: <DummyContent />,
  },
  {
    category: "Life",
    title: "Celebrate life, unfiltered.",
    src: "/premium_photo-1687989651281-d9dfee04ec74.png",
    content: <DummyContent />,
  },
  {
    category: "Community",
    title: "Earn while inspiring others.",
    src: "/ezgif-3-489a4dc383.gif",
    content: <DummyContent />,
  },
];

const Beams = () => {
  return (
    <svg
      width="380"
      height="315"
      viewBox="0 0 380 315"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute top-0 left-1/2 -translate-x-1/2 w-full pointer-events-none"
    >
      <g filter="url(#filter0_f_120_7473)">
        <circle cx="34" cy="52" r="114" fill="#6925E7" />
      </g>
      <g filter="url(#filter1_f_120_7473)">
        <circle cx="332" cy="24" r="102" fill="#8A4BFF" />
      </g>
      <g filter="url(#filter2_f_120_7473)">
        <circle cx="191" cy="53" r="102" fill="#802FE3" />
      </g>
      <defs>
        <filter
          id="filter0_f_120_7473"
          x="-192"
          y="-174"
          width="452"
          height="452"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="56" result="effect1_foregroundBlur_120_7473" />
        </filter>
        <filter
          id="filter1_f_120_7473"
          x="70"
          y="-238"
          width="524"
          height="524"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="80" result="effect1_foregroundBlur_120_7473" />
        </filter>
        <filter
          id="filter2_f_120_7473"
          x="-71"
          y="-209"
          width="524"
          height="524"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="80" result="effect1_foregroundBlur_120_7473" />
        </filter>
      </defs>
    </svg>
  );
};

const Rays = ({ className }: { className?: string }) => {
  return (
    <svg
      width="380"
      height="397"
      viewBox="0 0 380 397"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("absolute left-0 top-0  pointer-events-none z-[1]", className)}
    >
      <g filter="url(#filter0_f_120_7480)">
        <path
          d="M-37.4202 -76.0163L-18.6447 -90.7295L242.792 162.228L207.51 182.074L-37.4202 -76.0163Z"
          fill="url(#paint0_linear_120_7480)"
        />
      </g>
      <g style={{ mixBlendMode: "plus-lighter" }} opacity="0.3" filter="url(#filter1_f_120_7480)">
        <path
          d="M-109.54 -36.9027L-84.2903 -58.0902L178.786 193.228L132.846 223.731L-109.54 -36.9027Z"
          fill="url(#paint1_linear_120_7480)"
        />
      </g>
      <g style={{ mixBlendMode: "plus-lighter" }} opacity="0.86" filter="url(#filter2_f_120_7480)">
        <path
          d="M-100.647 -65.795L-69.7261 -92.654L194.786 157.229L139.51 197.068L-100.647 -65.795Z"
          fill="url(#paint2_linear_120_7480)"
        />
      </g>
      <g style={{ mixBlendMode: "plus-lighter" }} opacity="0.31" filter="url(#filter3_f_120_7480)">
        <path
          d="M163.917 -89.0982C173.189 -72.1354 80.9618 2.11525 34.7334 30.1553C-11.495 58.1954 -106.505 97.514 -115.777 80.5512C-125.048 63.5885 -45.0708 -3.23233 1.15763 -31.2724C47.386 -59.3124 154.645 -106.061 163.917 -89.0982Z"
          fill="#8A50FF"
        />
      </g>
      <g style={{ mixBlendMode: "plus-lighter" }} filter="url(#filter4_f_120_7480)">
        <path d="M34.2031 13.2222L291.721 269.534" stroke="url(#paint3_linear_120_7480)" />
      </g>
      <g style={{ mixBlendMode: "plus-lighter" }} filter="url(#filter5_f_120_7480)">
        <path d="M41 -40.9331L298.518 215.378" stroke="url(#paint4_linear_120_7480)" />
      </g>
      <g style={{ mixBlendMode: "plus-lighter" }} filter="url(#filter6_f_120_7480)">
        <path d="M61.3691 3.8999L317.266 261.83" stroke="url(#paint5_linear_120_7480)" />
      </g>
      <g style={{ mixBlendMode: "plus-lighter" }} filter="url(#filter7_f_120_7480)">
        <path d="M-1.46191 9.06348L129.458 145.868" stroke="url(#paint6_linear_120_7480)" strokeWidth="2" />
      </g>
      <defs>
        <filter
          id="filter0_f_120_7480"
          x="-49.4199"
          y="-102.729"
          width="304.212"
          height="296.803"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="6" result="effect1_foregroundBlur_120_7480" />
        </filter>
        <filter
          id="filter1_f_120_7480"
          x="-115.54"
          y="-64.0903"
          width="300.326"
          height="293.822"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="3" result="effect1_foregroundBlur_120_7480" />
        </filter>
        <filter
          id="filter2_f_120_7480"
          x="-111.647"
          y="-103.654"
          width="317.434"
          height="311.722"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="5.5" result="effect1_foregroundBlur_120_7480" />
        </filter>
        <filter
          id="filter3_f_120_7480"
          x="-212.518"
          y="-188.71"
          width="473.085"
          height="369.366"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="48" result="effect1_foregroundBlur_120_7480" />
        </filter>
        <filter
          id="filter4_f_120_7480"
          x="25.8447"
          y="4.84521"
          width="274.234"
          height="273.065"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="4" result="effect1_foregroundBlur_120_7480" />
        </filter>
        <filter
          id="filter5_f_120_7480"
          x="32.6416"
          y="-49.3101"
          width="274.234"
          height="273.065"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="4" result="effect1_foregroundBlur_120_7480" />
        </filter>
        <filter
          id="filter6_f_120_7480"
          x="54.0078"
          y="-3.47461"
          width="270.619"
          height="272.68"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="3.5" result="effect1_foregroundBlur_120_7480" />
        </filter>
        <filter
          id="filter7_f_120_7480"
          x="-9.2002"
          y="1.32812"
          width="146.396"
          height="152.275"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="3.5" result="effect1_foregroundBlur_120_7480" />
        </filter>
        <linearGradient
          id="paint0_linear_120_7480"
          x1="-57.5042"
          y1="-134.741"
          x2="403.147"
          y2="351.523"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.214779" stopColor="#AF53FF" />
          <stop offset="0.781583" stopColor="#B253FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_120_7480"
          x1="-122.154"
          y1="-103.098"
          x2="342.232"
          y2="379.765"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.214779" stopColor="#AF53FF" />
          <stop offset="0.781583" stopColor="#9E53FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_120_7480"
          x1="-106.717"
          y1="-138.534"
          x2="359.545"
          y2="342.58"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.214779" stopColor="#9D53FF" />
          <stop offset="0.781583" stopColor="#A953FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_120_7480"
          x1="72.701"
          y1="54.347"
          x2="217.209"
          y2="187.221"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#AF81FF" />
          <stop offset="1" stopColor="#C081FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_120_7480"
          x1="79.4978"
          y1="0.191681"
          x2="224.006"
          y2="133.065"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#AF81FF" />
          <stop offset="1" stopColor="#C081FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_120_7480"
          x1="79.6568"
          y1="21.8377"
          x2="234.515"
          y2="174.189"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#B981FF" />
          <stop offset="1" stopColor="#CF81FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_120_7480"
          x1="16.119"
          y1="27.6966"
          x2="165.979"
          y2="184.983"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A981FF" />
          <stop offset="1" stopColor="#CB81FF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Landing;
