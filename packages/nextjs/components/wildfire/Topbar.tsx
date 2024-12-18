"use client";

import { useContext } from "react";
import Link from "next/link";
import { Search } from "./Search";
import { UserMenu } from "./UserMenu";
import { Notification } from "./UserNotification";
import { AuthContext } from "~~/app/context";
import Image from "next/image";

export const Topbar = () => {
  /* CONSUME CONTEXT */
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      <div id="auth-ui-topbar" className="flex flex-row gap-1 m-2">
        <Search />
        {isAuthenticated && <Notification />}
        {isAuthenticated && <UserMenu launchApp={false} wildpay={true} />}
        {!isAuthenticated && (
          <Link href="/login"  className="flex flex-row font-semibold justify-center items-center w-fit px-3 py-3 h-fit rounded-xl bg-white text-black border border-neutral-900 text-sm">
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
          Login
        </Link>
        )}
      </div>
    </>
  );
};
