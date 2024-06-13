"use client";

import React, { useContext, useRef } from "react";
import Link from "next/link";
import { Avatar } from "../Avatar";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { AuthContext, AuthUserContext } from "~~/app/context";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { logout } from "~~/utils/logout";

export const UserMenu = (launchApp: any) => {
  console.log("launchApp",launchApp.launchApp)
  const { refetchAuth } = useContext(AuthContext);
  const { loadingAuthUser, profile, refetchAuthUser } = useContext(AuthUserContext);

  //DROPDOWN
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const closeDropdown = () => {
    dropdownRef.current?.removeAttribute("open");
  };
  useOutsideClick(dropdownRef, closeDropdown);

  //ACTION: handle logout
  const handleLogout = async () => {
    try {
      await logout();
      await refetchAuth();
      await refetchAuthUser();
    } catch (error) {
      console.error("Logout error:", error);
      //router.push("error");
    }
  };
  return (
    <>
      {!loadingAuthUser && profile && (
        <details ref={dropdownRef} className="dropdown dropdown-end">
          <summary className="btn bg-base-100">
            <Avatar profile={profile} width={6} height={6} />
            <span>{profile.username}</span>
            <ChevronDownIcon width={12} />
          </summary>
          <ul className="p-2 menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
            <li>
              <Link href="/profile" onClick={closeDropdown}>
                My Profile
              </Link>
            </li>
            <li>
              <Link href="/account" onClick={closeDropdown}>
                My Account
              </Link>
            </li>
            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
            {launchApp.launchApp && (
              <li className="bg-primary rounded-full">
                <Link href={"/feed"} className="flex flex-row justify-between">
                  <span>Launch App</span>
                  <span className="-mr-3">
                    <ChevronRightIcon width={20} />
                  </span>
                </Link>
              </li>
            )}
          </ul>
        </details>
      )}
    </>
  );
};
