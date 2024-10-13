"use client";

import { useContext } from "react";
import Link from "next/link";

import { AuthContext } from "@/app/context";

import { Search } from "./Search";
import { UserMenu } from "./UserMenu";
import { Notification } from "./UserNotification";

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
          <Link href="/login" className="btn btn-outline btn-small mx-2">
            Login
          </Link>
        )}
      </div>
    </>
  );
};
