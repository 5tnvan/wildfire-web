"use client";

import React, { useContext, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { ChevronDownIcon, ChevronRightIcon, Cog6ToothIcon, UserCircleIcon } from "@heroicons/react/24/outline";

import { AuthContext, AuthUserContext } from "@/app/context";
import { useOutsideClick } from "@/hooks/scaffold-eth";
import { logout } from "@/utils/logout";

import { Avatar } from "../Avatar";

export const UserMenu = ({ launchApp, wildpay }: any) => {
  const { refetchAuth } = useContext(AuthContext);
  const { loadingAuthUser, profile } = useContext(AuthUserContext);

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
      refetchAuth();
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
            <span className="hidden md:block">{profile.username}</span>
            <ChevronDownIcon width={12} className="hidden md:block" />
          </summary>
          <ul className="p-2 menu dropdown-content z-20 bg-base-100 rounded-box w-52 border border-base-200">
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
              <li className="bg-blue-600 rounded-full">
                <Link
                  href={"https://www.wildpay.app/" + profile.username}
                  target="new"
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
              <li className="bg-base-200 rounded-full">
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
