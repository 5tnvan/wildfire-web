"use client";

import { UserMenu } from "./UserMenu";

export const Topbar = () => {
  return (
    <>
      <div id="auth-ui-topbar" className="flex flex-row gap-1 mb-2">
        <input type="text" placeholder="Search" className="input grow bg-base-200" />
        <UserMenu launchApp={false} />
      </div>
    </>
  );
};
