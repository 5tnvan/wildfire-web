"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { DevicePhoneMobileIcon, VideoCameraIcon } from "@heroicons/react/24/solid";

const Create: NextPage = () => {
  return (
    <div className="flex flex-row gap-5 justify-center items-center grow">
      <div className="card glass w-96">
          <figure>
            <Image
              src="/premium_photo-1687989651281-d9dfee04ec74.png"
              alt="image"
              width={500}
              height={500}
              className="rounded-2xl"
            />
          </figure>
          <div className="p-4">
            <div className="flex flex-row items-center justify-between">
            <h2 className="text-2xl text-left font-bold mb-0">Upload video</h2>
            <p className="text-primary">up to 10 mins</p>
          </div>
          <p className="text-left  mt-4">Upload long-format video.</p>
          <Link href="/create/long-form" className="btn text-base">
            <VideoCameraIcon width={15} />
            Post video
          </Link>
          </div>
        </div>
        <div className="card glass w-96">
          <figure>
            <Image
              src="/climb-img.png"
              alt="image"
              width={500}
              height={500}
              className="rounded-2xl"
            />
          </figure>
          <div className="p-4">
            <div className="flex flex-row items-center justify-between">
            <h2 className="text-2xl text-left font-bold mb-0">Upload short</h2>
            <p className="text-primary">from 3 seconds</p>
          </div>
          <p className="text-left  mt-4">Upload vertical short-form video.</p>
          <Link href="/create/short-form" className="btn text-base">
            <DevicePhoneMobileIcon width={15} />
            Post short
          </Link>
          </div>
        </div>
    </div>
  );
};

export default Create;
