"use client";

import React, { useContext, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar } from "./Avatar";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { AuthContext, AuthUserContext } from "~~/app/context";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { logout } from "~~/utils/logout";

/**
 * Site header
 */
export const Header = () => {
  const { isAuthenticated, refetchAuth } = useContext(AuthContext);
  const { profile, refetchAuthUser } = useContext(AuthUserContext);

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
    <div className="sticky bg-base-300 lg:static top-0 navbar min-h-0 flex-shrink-0 justify-between z-20 px-0 sm:px-2">
      <div className="navbar-start w-full justify-between ">
        <Link href="/">
          <Image
            src={`/wildfire-logo-lit.png`}
            alt="hero"
            height={80}
            width={80}
            className="rounded-2xl object-cover h-full object-left-top mx-2"
            draggable={false}
            style={{ width: "auto", height: "auto" }}
          />
        </Link>

        <div className=" lg:flex lg:flex-nowrap ">
          {isAuthenticated && profile && (
            <details ref={dropdownRef} className="dropdown dropdown-end">
              <summary className="btn bg-base-100 relative">
                <Avatar profile={profile} width={6} height={6} />
                <span>{profile.username}</span>
                <ChevronDownIcon width={12} />
              </summary>
              <ul className="p-2 menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                {/* <li>
                  <Link href="/profile/view" onClick={closeDropdown}>
                    My Profile
                  </Link>
                </li> */}
                <li>
                  <Link href="/account" onClick={closeDropdown}>
                    My Account
                  </Link>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </details>
          )}
          {!isAuthenticated && (
            <Link href="/auth/login" className="btn btn-outline btn-small mx-2">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
