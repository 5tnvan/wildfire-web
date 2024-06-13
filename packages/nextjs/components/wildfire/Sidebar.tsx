"use client";

import Image from "next/image";
import Link from "next/link";
import { EyeIcon, HomeIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { SwitchTheme } from "~~/components/wildfire/SwitchTheme";

export const Sidebar = () => {
  return (
    <>
      <div
        id="auth-ui-sidebar"
        className="menu w-64 h-dvh text-base-content bg-[url('/sidebar-light.png')] dark:bg-[url('/sidebar-dark.png')]"
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
          <li>
            <Link href="/watch-vertical">
              <SparklesIcon width={23} />
              Discover
            </Link>
          </li>
        </ul>
        <div className="pointer-events-none flex flex-row justify-end p-1">
          <SwitchTheme className={`pointer-events-auto`} />
        </div>
      </div>
    </>
  );
};
