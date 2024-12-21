"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import IdeaModal from "./IdeaModal";
import {
  ChatBubbleLeftEllipsisIcon,
  CircleStackIcon,
  DevicePhoneMobileIcon,
  Square2StackIcon,
  UserGroupIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/solid";
import { HomeIcon, LightBulbIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { Bars3Icon, FaceSmileIcon, FireIcon, NewspaperIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { AuthContext, AuthUserContext } from "~~/app/context";
import { SwitchTheme } from "~~/components/wildfire/SwitchTheme";
import { useRouter } from "next/navigation";

export const Sidebar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  //CONSUME PROVIDERS
  const { profile } = useContext(AuthUserContext);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  //Idea MODAL
  const [isIdeaModalOpen, setIdeaModalOpen] = useState(false);

  const closeIdeaModal = () => {
    setIdeaModalOpen(false);
  };

  return (
    <>
      {isIdeaModalOpen && <IdeaModal data={{ profile }} onClose={closeIdeaModal} />}
      <div id="auth-ui-sidebar-sm" className="md:hidden text-base-content p-3 bg-base-200">
        <div className="flex flex-row items-center justify-between gap-2">
          {isMenuOpen ? (
            <XMarkIcon width={24} onClick={handleToggleMenu} />
          ) : (
            <Bars3Icon width={24} className="" onClick={handleToggleMenu} />
          )}

          <Link href="/">
            <Image
              src={`/spark/spark-text-logo.png`}
              alt="hero"
              height={120}
              width={120}
              className=""
              draggable={false}
              style={{ width: "100px", height: "auto" }}
            />
          </Link>
          <div className="flex flex-row gap-1">
          <div
            className="p-3 rounded-full bg-base-100"
            onClick={() => {
              if (isAuthenticated) {
                setIdeaModalOpen(true);
              } else {
                router.push("/login");
              }
              closeMenu();
            }}
          >
            <SparklesIcon width={15} />
          </div>
          <Link href="/create" className="p-3 rounded-full bg-base-100" onClick={closeMenu}>
            <VideoCameraIcon width={15} />
          </Link>
          </div>
          
        </div>
        {isMenuOpen && (
          <div id="auth-ui-sidebar-md" className="w-full text-base-content">
            <div className="grow menu">
              <ul className="text-sm py-2" onClick={closeMenu}>
                <li>
                  <Link href="/home" className="flex flex-row gap-4">
                    <HomeIcon width={23} /> Home
                  </Link>
                </li>
                <li>
                  <Link href="/feed" className="flex flex-row gap-4">
                    <Square2StackIcon width={23} /> Feed
                  </Link>
                </li>
                <li>
                  <Link href="/sparks" className="flex flex-row gap-4">
                    <SparklesIcon width={23} /> Sparks
                  </Link>
                </li>
                <li>
                  <Link href="/shorts" className="flex flex-row gap-4">
                    <DevicePhoneMobileIcon width={23} /> Shorts
                  </Link>
                </li>
                <li>
                  <Link href="/videos" className="flex flex-row gap-4">
                    <VideoCameraIcon width={23} /> Videos
                  </Link>
                </li>
                <li>
                  <Link href="/creators" className="flex flex-row gap-4">
                    <UserGroupIcon width={23} />
                    Community
                  </Link>
                </li>
              </ul>
              <div className="font-semibold mt-3 ml-3 text-primary">Watch</div>
              <ul className="py-2">
                <li>
                  <Link href="/videos" className="flex flex-row gap-2 font-semibold text-sm">
                    <FireIcon width={23} /> What's happening
                  </Link>
                </li>
                <li>
                  <Link href="/videos" className="flex flex-row gap-4 text-sm">
                    <NewspaperIcon width={23} /> News
                  </Link>
                </li>
                <li>
                  <Link href="/videos" className="flex flex-row gap-4 text-sm">
                    <FaceSmileIcon width={23} /> Humour
                  </Link>
                </li>
                <li>
                  <Link href="/videos" className="flex flex-row gap-4 text-sm">
                    <LightBulbIcon width={23} />
                    Learning
                  </Link>
                </li>
                <li>
                  <Link href="/videos" className="flex flex-row gap-4 text-sm">
                    <ChatBubbleLeftEllipsisIcon width={23} />
                    Conversations
                  </Link>
                </li>
                <li>
                  <Link href="/videos" className="flex flex-row gap-4 text-sm">
                    <CircleStackIcon width={23} />
                    Finance
                  </Link>
                </li>
              </ul>
              <Link href="/sparkapp" className="flex flex-row mt-3 ml-3 px-3 py-2 h-fit font-semibold justify-center items-center w-fit rounded-xl border border-neutral-500 text-xs transform transition-transform duration-300 hover:-translate-y-2">
                <div className="mr-2 flex flex-row justify-center items-center">
                  <Image
                    src={`/spark/spark-logo.png`}
                    alt="spark logo"
                    height={120}
                    width={120}
                    className="w-4 h-auto"
                    draggable={false}
                  />
                </div>
                Support Spark
              </Link>
              <Link href="/sparkl" className="flex flex-row mt-3 ml-3 px-3 py-2 h-fit font-semibold justify-center items-center w-fit rounded-xl border border-neutral-500 text-xs transform transition-transform duration-300 hover:-translate-y-2">
                <div className="mr-2 flex flex-row justify-center items-center">
                  <Image
                    src={`/spark/spark-logo.png`}
                    alt="spark logo"
                    height={120}
                    width={120}
                    className="w-4 h-auto"
                    draggable={false}
                  />
                </div>
                Become a media creator
              </Link>
            </div>
            <div onClick={closeMenu}>
              <SwitchTheme className={`pointer-events-auto`} />
            </div>
          </div>
        )}
      </div>

      <div
        id="auth-ui-sidebar-md"
        className="hidden md:flex w-72 h-dvh relative text-base-content bg-[url('/sidebar-light.png')] dark:bg-[url('/sidebar-dark.png')]"
      >
        <div className="grow menu">
          <Link href="/">
            <Image
              src={`/spark/spark-text-logo.png`}
              alt="hero"
              height={300}
              width={300}
              className="mt-5 mb-2 ml-4"
              draggable={false}
              style={{ width: "100px", height: "auto" }}
            />
          </Link>
          <ul className="text-sm py-2">
            <li>
              <Link href="/home" className="flex flex-row gap-4">
                <HomeIcon width={23} /> Home
              </Link>
            </li>
            <li>
              <Link href="/feed" className="flex flex-row gap-4">
                <Square2StackIcon width={23} /> Feed
              </Link>
            </li>
            <li>
              <Link href="/sparks" className="flex flex-row gap-4">
                <SparklesIcon width={23} /> Sparks
              </Link>
            </li>
            <li>
              <Link href="/shorts" className="flex flex-row gap-4">
                <DevicePhoneMobileIcon width={23} /> Shorts
              </Link>
            </li>
            <li>
              <Link href="/videos" className="flex flex-row gap-4">
                <VideoCameraIcon width={23} /> Videos
              </Link>
            </li>
            <li>
              <Link href="/creators" className="flex flex-row gap-4">
                <UserGroupIcon width={23} />
                Community
              </Link>
            </li>
          </ul>
          <div className="font-semibold mt-3 ml-3 text-primary">Watch</div>
          <ul className="py-2">
            <li>
              <Link href="/videos" className="flex flex-row gap-2 font-semibold text-sm">
                <FireIcon width={23} /> What's happening
              </Link>
            </li>
            <li>
              <Link href="/videos" className="flex flex-row gap-4 text-sm">
                <NewspaperIcon width={23} /> News
              </Link>
            </li>
            {/* <li>
              <Link href="/videos" className="flex flex-row gap-4 text-sm">
                <FaceSmileIcon width={23} /> Humour
              </Link>
            </li>
            <li>
              <Link href="/videos" className="flex flex-row gap-4 text-sm">
                <LightBulbIcon width={23} />
                Learning
              </Link>
            </li> */}
            {/* <li>
              <Link href="/videos" className="flex flex-row gap-4 text-sm">
                <ChatBubbleLeftEllipsisIcon width={23} />
                Conversations
              </Link>
            </li> */}
            {/* <li>
              <Link href="/videos" className="flex flex-row gap-4 text-sm">
                <CircleStackIcon width={23} />
                Finance
              </Link>
            </li> */}
          </ul>
          <Link href="/sparkapp" className="flex flex-row mt-3 ml-3 px-3 py-2 h-fit font-semibold justify-center items-center w-fit rounded-xl border border-neutral-500 text-xs transform transition-transform duration-300 hover:-translate-y-2">
            <div className="mr-2 flex flex-row justify-center items-center">
              <Image
                src={`/spark/spark-logo.png`}
                alt="spark logo"
                height={120}
                width={120}
                className="w-4 h-auto"
                draggable={false}
              />
            </div>
            Support Spark
          </Link>
          <Link href="/sparkl" className="flex flex-row mt-3 ml-3 px-3 py-2 h-fit font-semibold justify-center items-center w-fit rounded-xl border border-neutral-500 text-xs transform transition-transform duration-300 hover:-translate-y-2">
                <div className="mr-2 flex flex-row justify-center items-center">
                  <Image
                    src={`/spark/spark-logo.png`}
                    alt="spark logo"
                    height={120}
                    width={120}
                    className="w-4 h-auto"
                    draggable={false}
                  />
                </div>
                Become a media creator
              </Link>
        </div>

        <div className="absolute bottom-2 w-full px-4">
          <div className="flex flex-col">
            <Link href="/create" className="btn btn-neutral">
              <span>Create</span>
              <VideoCameraIcon width={20} />
            </Link>
            <div className="btn btn-primary mt-1" onClick={isAuthenticated ? () => setIdeaModalOpen(true) : () => router.push("/login")}>
              <span>Spark Idea</span>
              <SparklesIcon width={20} />
            </div>
          </div>
          <div className="pointer-events-none flex flex-row justify-center p-1">
            <SwitchTheme className={`pointer-events-auto`} />
          </div>
        </div>
      </div>
    </>
  );
};
