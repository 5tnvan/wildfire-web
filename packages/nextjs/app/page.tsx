"use client";

import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { ContainerScroll } from "~~/components/ui/container-scroll-animation";
import { WobbleCard } from "~~/components/ui/wooble-card";

const Home: NextPage = () => {
  return (
    <>
      <div className="bg-white">
        <div className="flex flex-row justify-between items-center p-5">
          <Link href="https://www.3seconds.me">
            <Image
              src={`/wildfire-logo-lit.png`}
              alt="hero"
              height={80}
              width={80}
              className="rounded-2xl object-cover h-full object-left-top"
              draggable={false}
            />
          </Link>
          <Link
            href="https://youtube.com/clip/UgkxjdMK-9RyykIG7JHpuWkTQX4h8w7Mlbr6?si=UsxzkYpD2LuV91O8"
            className="btn btn-small btn-outline"
          >
            Watch Preview
          </Link>
        </div>

        {/* GOT 3 SECONDS? */}
        <div className="flex flex-col overflow-hidden">
          <ContainerScroll
            titleComponent={
              <>
                <h1 className="text-6xl md:text-[4rem] font-semibold text-black 0">
                  Got
                  <br />
                  <span className="text-6xl md:text-[6rem] font-bold mt-1 leading-none">3 seconds?</span>
                </h1>
              </>
            }
          >
            <Image
              src={`/b2.png`}
              alt="hero"
              height={720}
              width={1400}
              className="mx-auto rounded-2xl object-cover h-full object-left-top"
              draggable={false}
            />
          </ContainerScroll>
        </div>

        {/* WE ARE WORKING HARD TO GET THE APP ON */}
        <h1 className="text-3xl text-center">We are working hard to get on...</h1>
        <div className="flex flex-row justify-center gap-4">
          <div className="flex items-center justify-center w-48 mt-3 text-black bg-transparent border border-black h-14 rounded-xl">
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
              <div className="-mt-1 font-sans text-2xl font-semibold">App Store</div>
            </div>
          </div>
          <div className="flex items-center justify-center w-48 mt-3 text-white bg-black rounded-lg h-14">
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
          </div>
        </div>

        {/* 3-GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full my-32 px-5">
          <WobbleCard
            containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
            className=""
          >
            <div className="max-w-xs">
              <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
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
            />
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 min-h-[300px]">
            <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Extremely. Short. Content.
            </h2>
            <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
              No more doom scrolling—stay informed about the world, 24/7, in just 3 seconds.
            </p>
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
            <div className="max-w-sm">
              <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                Web3 pays 100%.
              </h2>
              <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
                Creators get paid instantly, and retain all their revenue.
              </p>
            </div>
            <Image
              src="/100.png"
              width={300}
              height={300}
              alt="linear demo image"
              className="absolute right-3 grayscale filter bottom-0 object-contain rounded-2xl"
            />
          </WobbleCard>
        </div>

        {/* FOOTER */}
        <footer className="footer footer-center p-10 bg-zinc-100 text-primary-content">
          <aside>
            <div className="flex flex-col items-center font-bold gap-1">
              <Image
                src="/adaptive-icon-sm.png"
                width={60}
                height={60}
                alt="linear demo image"
                className="align-center"
              />
              <p>
                wildfire <br />3 Seconds App
              </p>
            </div>
            <p>
              <Link href="https://micalabs.org/" className="link">
                MicaLabs
              </Link>{" "}
              © 2024 - All rights reserved
            </p>
          </aside>
          <nav>
            <div className="grid grid-flow-col gap-4">
              <a href="https://x.com/micalabshq">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a href="https://www.youtube.com/@micalabshq">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                </svg>
              </a>
            </div>
          </nav>
        </footer>
      </div>
    </>
  );
};

export default Home;
