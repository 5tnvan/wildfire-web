"use client";

import React, { useRef, useState } from "react";
import { NextPage } from "next";
import { VideoCameraIcon } from "@heroicons/react/24/solid";

const Create: NextPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0] && files[0].type.includes("video")) {
      const videoFile = files[0];
      const url = URL.createObjectURL(videoFile);
      setFile(videoFile);
      setVideoUrl(url);
    } else {
      alert("Please upload a valid video file");
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files[0] && files[0].type.includes("video")) {
      const videoFile = files[0];
      const url = URL.createObjectURL(videoFile);
      setFile(videoFile);
      setVideoUrl(url);
    } else {
      alert("Please upload a valid video file");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="flex flex-row p-2 pt-0 h-screen-custom">
      {/* DRAG N DROP */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex flex-col items-center bg-base-100 rounded-lg p-4"
      >
        <div className="font-semibold">Choose a video</div>
        <div className="flex flex-col grow justify-center">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="video-upload"
          />
          <label htmlFor="video-upload" className="flex flex-col items-center cursor-pointer">
            <div className="flex flex-col grow items-center">
              <VideoCameraIcon width={48} />
              <span className="text-xl">Drag 'n' drop</span>
              <div className="btn btn-base-300 mt-3">Select a file from a computer</div>
            </div>
          </label>
        </div>
      </div>
      {/* PREVIEW */}
      <div className="flex flex-col items-center bg-base-100 rounded-lg p-4 grow ml-2">
        <div className="flex font-semibold">Preview</div>
        {!videoUrl && (
          <div className="flex flex-col justify-center items-center rounded-lg grow">
            <div className="flex flex-col justify-center items-center h-[640px] w-[360px] bg-neutral rounded-lg text-white dark:text-black">
              9:16
            </div>
          </div>
        )}
        {videoUrl && (
          <div className="flex flex-col justify-center items-center rounded-lg grow">
            <div className="flex flex-col justify-center items-center h-[640px] w-[360px] bg-neutral rounded-lg text-white dark:text-black">
              <video ref={videoRef} src={videoUrl} controls className="h-full w-full object-cover" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Create;
