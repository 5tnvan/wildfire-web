"use client";

import React, { useContext, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar } from "../Avatar";
import { ChevronDownIcon, ChevronRightIcon, Cog6ToothIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { AuthContext, AuthUserAccountContext, AuthUserContext, AuthUserFollowsContext } from "~~/app/context";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { logout } from "~~/utils/logout";

export const UserMenu = ({ launchApp, wildpay }: any) => {
  const { refetchAuth } = useContext(AuthContext);
  const { loadingAuthUser, profile, refetchAuthUser } = useContext(AuthUserContext);
  const { refetchAuthUserFollows } = useContext(AuthUserFollowsContext);
  const { refetchAuthUserAccount } = useContext(AuthUserAccountContext);

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
      await refetchAuthUserFollows();
      await refetchAuthUserAccount();
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
                <UserCircleIcon width={18} />
                My Profile
              </Link>
            </li>
            <li>
              <Link href="/account" onClick={closeDropdown}>
                <Cog6ToothIcon width={18} />
                My Account
              </Link>
            </li>
            {wildpay && (
              <li className="bg-primary rounded-full">
                <Link
                  href="https://www.wildpay.app/home"
                  onClick={closeDropdown}
                  className="flex flex-row justify-between"
                >
                  <div className="flex flex-row gap-2">
                    <Image alt="wildpay" src="/wildpay-logo-white.svg" width={18} height={18} />
                    <span className="text-white">My Wildpay</span>
                  </div>
                  <div className="-mr-3">
                    <ChevronRightIcon width={20} color="white" />
                  </div>
                </Link>
              </li>
            )}
            {launchApp && (
              <li className="bg-primary rounded-full">
                <Link href={"/feed"} className="flex flex-row justify-between">
                  <Image alt="wildpay" src="/fire-icon-36-36.png" width={18} height={18} />
                  <span>Launch App</span>
                  <span className="-mr-3">
                    <ChevronRightIcon width={20} />
                  </span>
                </Link>
              </li>
            )}
            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </details>
      )}
    </>
  );
};
