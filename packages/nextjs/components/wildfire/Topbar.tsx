"use client";

import { useContext } from "react";
import Link from "next/link";
import { Search } from "./Search";
import { UserMenu } from "./UserMenu";
import { AuthContext } from "~~/app/context";

export const Topbar = () => {
  /* CONSUME CONTEXT */
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      <div id="auth-ui-topbar" className="flex flex-row gap-1 m-2">
        <Search />
        {isAuthenticated == true && <UserMenu launchApp={false} wildpay={true} />}
        {isAuthenticated == false && (
          <Link href="/login" className="btn btn-outline btn-small mx-2">
            Login
          </Link>
        )}
      </div>
    </>
  );
};
