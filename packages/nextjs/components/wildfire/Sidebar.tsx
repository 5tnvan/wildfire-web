"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { VideoCameraIcon } from "@heroicons/react/20/solid";
import { EyeIcon, HomeIcon } from "@heroicons/react/24/outline";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { SwitchTheme } from "~~/components/wildfire/SwitchTheme";

export const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <>
      <div id="auth-ui-sidebar-sm" className="md:hidden text-base-content p-3 bg-base-200">
        <div className="flex flex-row items-center justify-between gap-2">
          {isMenuOpen ? (
            <XMarkIcon width={24} onClick={handleToggleMenu} />
          ) : (
            <Bars3Icon width={24} className="" onClick={handleToggleMenu} />
          )}

          <Link href="/">
            <Image
              src={`/wildfire-logo-lit.png`}
              alt="hero"
              height={120}
              width={120}
              className=""
              draggable={false}
              style={{ width: "70px", height: "auto" }}
            />
          </Link>
          <Link href="/create" className="p-3 rounded-full bg-base-100">
            <VideoCameraIcon width={15} />
          </Link>
        </div>
        {isMenuOpen && (
          <div id="auth-ui-sidebar-md" className="w-full text-base-content">
            <ul className="grow text-base">
              <li className="my-1">
                <Link href="/feed" className="btn bg-zinc-200 dark:bg-zinc-950 w-full">
                  <HomeIcon width={23} /> Feed
                </Link>
              </li>
              <li className="my-1">
                <Link href="/watch" className="btn bg-zinc-200 dark:bg-zinc-950 w-full">
                  <EyeIcon width={23} /> Watch
                </Link>
              </li>
            </ul>
            <SwitchTheme className={`pointer-events-auto`} />
          </div>
        )}
      </div>

      <div
        id="auth-ui-sidebar-md"
        className="hidden md:flex menu w-64 h-dvh text-base-content bg-[url('/sidebar-light.png')] dark:bg-[url('/sidebar-dark.png')]"
      >
        <Link href="/">
          <Image
            src={`/wildfire-logo-lit.png`}
            alt="hero"
            height={120}
            width={120}
            className="mt-8 mb-2 ml-4"
            draggable={false}
            style={{ width: "70px", height: "auto" }}
          />
        </Link>
        <ul className="grow text-base">
          <li>
            <Link href="/feed">
              <HomeIcon width={23} /> Feed
            </Link>
          </li>
          <li>
            <Link href="/watch">
              <EyeIcon width={23} /> Watch
            </Link>
          </li>
          {/* <li>
            <Link href="/watch">
              <SparklesIcon width={23} />
              Discover
            </Link>
          </li> */}
        </ul>
        <Link href="/create" className="btn btn-neutral">
          <span>Create</span>
          <VideoCameraIcon width={20} />
        </Link>
        <div className="pointer-events-none flex flex-row justify-center p-1">
          <SwitchTheme className={`pointer-events-auto`} />
        </div>
      </div>
    </>
  );
};
