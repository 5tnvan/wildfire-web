"use client";

import { Search } from "./Search";
import { UserMenu } from "./UserMenu";

export const Topbar = () => {
  return (
    <>
      <div id="auth-ui-topbar" className="flex flex-row gap-1 m-2">
        <Search />
        <UserMenu launchApp={false} wildpay={true} />
      </div>
    </>
  );
};
