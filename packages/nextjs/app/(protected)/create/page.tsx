"use client";

import React, { useRef, useState } from "react";
import { NextPage } from "next";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { CheckCircleIcon, ChevronRightIcon, VideoCameraIcon } from "@heroicons/react/24/solid";
import { TimeAgo } from "~~/components/wildfire/TimeAgo";
import { useDailyPostLimit } from "~~/hooks/wildfire/useDailyPostLimit";

const Create: NextPage = () => {
  //FETCH DIRECTLY
  const { isLoading: isLoadingLimit, limit, posts, postLeft } = useDailyPostLimit();
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  console.log("useDailyPostLimit", limit, posts, postLeft);
  console.log("thumbnailUrl", thumbnailUrl);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0] && files[0].type.includes("video")) {
      const videoFile = files[0];
      const validationResult = await validateVideoFile(videoFile);
      if (validationResult.valid) {
        const url = URL.createObjectURL(videoFile);
        setFile(videoFile);
        setVideoUrl(url);
        createThumbnail(url); // Create thumbnail when video URL is set
      } else {
        handleValidationFailure(validationResult.errors);
      }
    } else {
      alert("Please upload a valid video file");
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files[0] && files[0].type.includes("video")) {
      const videoFile = files[0];
      const validationResult = await validateVideoFile(videoFile);
      if (validationResult.valid) {
        const url = URL.createObjectURL(videoFile);
        setFile(videoFile);
        setVideoUrl(url);
        createThumbnail(url); // Create thumbnail when video URL is set
      } else {
        handleValidationFailure(validationResult.errors);
      }
    } else {
      alert("Please upload a valid video file");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleSubmit = () => {
    if (limit == true) {
      alert("You've reached your 24hrs posting limit. Try again later.");
    }
    if (limit == false && videoUrl.length > 0 && thumbnailUrl.length > 0) {
      //post
    }
  };

  const handleValidationFailure = (errors: string[]) => {
    let errorMessage = "Validation failed:";
    errors.forEach(error => {
      errorMessage += `\n- ${error}`;
    });
    alert(errorMessage);
  };

  const validateVideoFile = async (videoFile: File): Promise<{ valid: boolean; errors: string[] }> => {
    const errors: string[] = [];

    // Check file size (5 MB limit)
    if (videoFile.size > 5 * 1024 * 1024) {
      errors.push("File size exceeds 5 MB");
    }

    // Create a video element to get duration and aspect ratio
    const video = document.createElement("video");
    video.src = URL.createObjectURL(videoFile);

    return new Promise<{ valid: boolean; errors: string[] }>(resolve => {
      video.onloadedmetadata = () => {
        // Check duration (between 2.5 and 3.5 seconds)
        const duration = video.duration;
        if (duration < 2.5 || duration > 3.5) {
          errors.push("Duration should be between 2.5 and 3.5 seconds");
        }

        // Check aspect ratio (9:16)
        const aspectRatioValid = video.videoWidth / video.videoHeight === 9 / 16;
        if (!aspectRatioValid) {
          errors.push("Aspect ratio should be 9:16");
        }

        resolve({ valid: errors.length === 0, errors });
      };

      video.onerror = () => resolve({ valid: false, errors: ["Failed to load the video"] });
    });
  };

  const createThumbnail = (videoSrc: string) => {
    const video = document.createElement("video");
    video.src = videoSrc;

    video.addEventListener("loadeddata", () => {
      // Seek to the middle of the video to ensure the frame has enough data
      video.currentTime = video.duration / 2;
    });

    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          if (blob) {
            const thumbnailUrl = URL.createObjectURL(blob);
            setThumbnailUrl(thumbnailUrl);
          }
        }, "image/jpeg");
      }
      // Clean up
      URL.revokeObjectURL(videoSrc);
    });

    video.addEventListener("error", () => {
      console.error("Error loading video for thumbnail generation");
    });
  };

  return (
    <div className="flex flex-row p-2 pt-0 h-screen-custom">
      <div className="flex flex-col">
        {/* DRAG N DROP */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="flex flex-col items-center bg-base-100 rounded-lg p-4 grow mb-2"
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
        {/* POST LIMIT */}
        <div className="flex flex-col items-center bg-base-100 rounded-lg p-4 grow">
          <div className="font-semibold">Your posts</div>
          <div className="flex flex-col grow justify-center items-center">
            {!isLoadingLimit && (
              <>
                {limit == true && <XCircleIcon width={48} color="red" />}
                {limit == false && <CheckCircleIcon width={48} color="green" />}
                {posts && posts.length > 0 && (
                  <div className="flex flex-row gap-1">
                    You posted{" "}
                    <span className="text-primary font-semibold">
                      <TimeAgo timestamp={posts[0].created_at} />
                    </span>
                    ago
                  </div>
                )}
                <div>
                  You can post <span className="text-primary font-semibold">{postLeft}x</span> today
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* PREVIEW */}
      <div className="flex flex-col items-center bg-base-100 rounded-lg p-4 grow ml-2 relative">
        <div className="flex font-semibold">Preview</div>
        {!videoUrl && (
          <div className="flex flex-col justify-center items-center rounded-lg grow">
            <div className="flex flex-col justify-center items-center h-[640px] w-[360px] bg-neutral rounded-lg">
              <label className="label cursor-pointer">
                <input type="checkbox" defaultChecked className="checkbox checkbox-primary" />
                <span className="label-text text-white dark:text-black ml-1">vertical 9:16</span>
              </label>
              <label className="label cursor-pointer">
                <input type="checkbox" defaultChecked className="checkbox checkbox-primary" />
                <span className="label-text text-white dark:text-black ml-1">3 seconds</span>
              </label>
              <label className="label cursor-pointer">
                <input type="checkbox" defaultChecked className="checkbox checkbox-primary" />
                <span className="label-text text-white dark:text-black ml-1">under 5MB</span>
              </label>
            </div>
          </div>
        )}
        {videoUrl && (
          <div className="flex items-center justify-between flex-row rounded-lg grow w-full">
            {thumbnailUrl && (
              <div className="w-20 m-auto">
                <img src={thumbnailUrl} alt="thumb" className="rounded-lg" />
                <span className="text-sm">Thumbnail</span>
              </div>
            )}
            <div className="flex flex-col justify-center items-center h-[640px] w-[360px] bg-neutral rounded-lg text-white dark:text-black">
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                className="h-full w-full object-cover rounded-lg"
                autoPlay
                loop
              />
            </div>
            <div className="btn btn-primary m-auto" onClick={handleSubmit}>
              Post Now <ChevronRightIcon width={14} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Create;
