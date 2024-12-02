"use client";

import React, { useContext, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserMenu } from "./UserMenu";
import { AuthContext, AuthUserContext } from "~~/app/context";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

/**
 * Site header
 */
export const Header = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { profile } = useContext(AuthUserContext);

  //DROPDOWN
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const closeDropdown = () => {
    dropdownRef.current?.removeAttribute("open");
  };
  useOutsideClick(dropdownRef, closeDropdown);

  return (
    <div className="sticky bg-base-200 lg:static top-0 navbar min-h-0 flex-shrink-0 justify-between z-20 px-0 sm:px-2">
      <div className="navbar-start w-full justify-between">
        <Link href="/" className="flex flex-row w-full">
          <Image
            src={`/spark/spark-text-logo.png`}
            alt="hero"
            height={50}
            width={50}
            className="mx-2"
            draggable={false}
            style={{ width: "100px", height: "auto" }}
          />
        </Link>

        <div className=" lg:flex lg:flex-nowrap ">
          {isAuthenticated == true && profile && <UserMenu launchApp={true} wildpay={false} />}
          {isAuthenticated == false && (
            <Link href="/login" className="btn btn-outline btn-small mx-2">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
