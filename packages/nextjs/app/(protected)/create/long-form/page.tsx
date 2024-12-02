"use client";

import React, { useContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { NextPage } from "next";
import * as tus from "tus-js-client";
import { MapPinIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { CheckCircleIcon, ChevronRightIcon, VideoCameraIcon } from "@heroicons/react/24/solid";
import { AuthContext, AuthUserContext } from "~~/app/context";
import LocationModal from "~~/components/wildfire/LocationModal";
import { TimeAgo } from "~~/components/wildfire/TimeAgo";
import { ACCESS_KEY, HOSTNAME, STORAGE_ZONE_NAME } from "~~/constants/BunnyAPI";
import { useCountries } from "~~/hooks/wildfire/useCountries";
import { useDailyPostLimitLongForm } from "~~/hooks/wildfire/useDailyPostLimitLongForm";
import { livepeerClient } from "~~/utils/livepeer/livepeer";
import { insertVideo, upsertVideo } from "~~/utils/wildfire/crud/long_form";

const CreateLong: NextPage = () => {
  const router = useRouter();

  //CONSUME PROVIDER
  const { user } = useContext(AuthContext);
  const { profile } = useContext(AuthUserContext);

  //FETCH DIRECTLY
  const { isLoading: isLoadingLimit, limit, posts, postLeft } = useDailyPostLimitLongForm();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [countryId, setCountryId] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { countries } = useCountries();

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

  const handleSubmitPost = async () => {
    if (limit === true) {
      alert("You've reached your 24hrs posting limit. Try again later.");
      return;
    }
    if (limit === false && videoUrl.length > 0 && thumbnailUrl.length > 0 && file) {
      try {
        setLoading(true);
        // Fetch the thumbnail blob
        const thumbnailBlob = await fetch(thumbnailUrl).then(res => res.blob());
        console.log("thumbnailBlob", thumbnailBlob);
        console.log("videoBlob", file);

        // Upload video
        const videoPath = await uploadToBunny(file, "video");
        console.log("videoPath", videoPath);

        // Upload thumbnail
        const thumbnailPath = await uploadToBunny(thumbnailBlob, "thumbnail");
        console.log("thumbnailPath", thumbnailPath);

        // Insert record into '3sec' table
        if (videoPath && thumbnailPath) {
          const res = await insertVideo(videoPath, thumbnailPath, countryId);
          if (Array.isArray(res) && res.length > 0) {
            const videoId = res[0].id;
            await uploadToLivepeer(file, videoId);
          }
        }
      } catch (error) {
        setLoading(false);
        alert("Failed to upload video. Please try again.");
      }
    }
  };

  const uploadToLivepeer = async (assetData: File, video_id: any) => {
    livepeerClient.asset
      .create(assetData)
      .then(async response => {
        console.log("Asset upload request:", response);
        const upload = new tus.Upload(assetData, {
          endpoint: response.data?.tusEndpoint,
          retryDelays: [0, 3000, 5000, 10000, 20000],
          metadata: {
            filename: `${profile.id}_${assetData.name}`,
            filetype: assetData.type,
          },
          onError: error => {
            console.error("Failed because: " + error);
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            console.log("bytesUploaded", bytesUploaded), console.log("bytesTotal", bytesTotal);
          },
          onSuccess: async () => {
            console.log("Download %s from %s", assetData.name, upload.url);
            if (upload.url != null) {
              // Insert record into '3sec' table
              const error = await upsertVideo(video_id, response.data?.asset.playbackId, user?.id);
              if (!error) {
                router.push("/" + profile.username);
              } else {
                console.log("error", error);
              }
            }
          },
        });
        upload.start();
      })
      .catch(error => {
        console.error("Error requesting asset upload:", error);
      });
  };

  const uploadToBunny = async (file: File | Blob, type: "video" | "thumbnail") => {
    const now = new Date().getTime();
    let bunnyUrl, pullZoneUrl, contentType;

    if (type === "video") {
      bunnyUrl = `https://${HOSTNAME}/${STORAGE_ZONE_NAME}/${profile.id}/${now}.mp4`;
      pullZoneUrl = `https://wildfire.b-cdn.net/${profile.id}/${now}.mp4`;
      contentType = "video/mp4";
    } else if (type === "thumbnail") {
      bunnyUrl = `https://${HOSTNAME}/${STORAGE_ZONE_NAME}/${profile.id}/${now}.jpg`;
      pullZoneUrl = `https://wildfire.b-cdn.net/${profile.id}/${now}.jpg`;
      contentType = "image/jpeg";
    } else {
      throw new Error("Unsupported file type");
    }

    const response = await fetch(bunnyUrl, {
      method: "PUT",
      headers: {
        AccessKey: ACCESS_KEY ?? "",
        "Content-Type": contentType,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload ${type}`);
    }

    return pullZoneUrl;
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

    // Check file size (1 GB limit)
    if (videoFile.size > 1 * 1024 * 1024 * 1024) {
      errors.push("File size exceeds 1 GB");
    }

    // Create a video element to get duration and aspect ratio
    const video = document.createElement("video");
    video.src = URL.createObjectURL(videoFile);

    return new Promise<{ valid: boolean; errors: string[] }>(resolve => {
      video.onloadedmetadata = () => {
        // Check duration (between 3 and 20 minutes)
        const duration = video.duration;
        if (duration < 3 * 60 || duration > 20 * 60) {
          errors.push("Video duration must be between 3 and 20 minutes.");
        }

        // Check aspect ratio (16:9)
        const aspectRatioValid = video.videoWidth / video.videoHeight === 16 / 9;
        if (!aspectRatioValid) {
          errors.push("Aspect ratio should be 16:9");
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

  const handleSetLocation = (country_id: any, country_name: any) => {
    setIsLocationModalOpen(true);
    setCountryId(country_id);
    setCountryName(country_name);
  };

  const closeLocationModal = () => {
    setIsLocationModalOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row p-2 pt-0 h-screen-custom">
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
                <div>
                  You can post <span className="text-primary font-semibold">{postLeft}x</span> today
                </div>
                {posts && posts.length > 0 && (
                  <div className="flex flex-row gap-1">
                    Last posted
                    <span className="text-primary font-semibold">
                      <TimeAgo timestamp={posts[0].created_at} />
                    </span>
                    ago
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* PREVIEW */}
      <div className="flex flex-col items-center bg-base-100 rounded-lg p-4 grow md:ml-2 relative mt-2 md:mt-0">
        <div className="flex font-semibold mb-2">Preview</div>
        {!videoUrl && (
          <div className="flex flex-col justify-center items-center rounded-lg grow">
            <div className="flex flex-col justify-center items-center h-[360px] w-[640px] bg-neutral rounded-lg">
              <label className="label cursor-pointer">
                <input type="checkbox" defaultChecked className="checkbox checkbox-primary" />
                <span className="label-text text-white dark:text-black ml-1">horizontal 16:9</span>
              </label>
              <label className="label cursor-pointer">
                <input type="checkbox" defaultChecked className="checkbox checkbox-primary" />
                <span className="label-text text-white dark:text-black ml-1">up to 30 mins</span>
              </label>
              <label className="label cursor-pointer">
                <input type="checkbox" defaultChecked className="checkbox checkbox-primary" />
                <span className="label-text text-white dark:text-black ml-1">under 2GB</span>
              </label>
            </div>
          </div>
        )}
        {videoUrl && (
          <div className="flex flex-col md:flex-row items-center justify-between rounded-lg grow w-full">
            {thumbnailUrl && (
              <div className="hidden md:flex w-1/3 flex-col items-center grow">
                <img src={thumbnailUrl} alt="thumb" className="rounded-lg w-[140px] glow" />
                <span className="text-sm">Thumbnail</span>
              </div>
            )}
            <div className="flex flex-col justify-center items-center h-[360px] w-[640px] bg-neutral rounded-lg text-white dark:text-black">
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                className="h-full w-full object-cover rounded-lg"
                autoPlay
                loop
              />
            </div>
            {limit == false && (
              <div className="flex flex-col w-full ml-0 mt-3 md:mt-0 md:w-1/3 md:ml-3 gap-2">
                <div className="btn btn-outline m-auto w-full md:w-auto" onClick={() => setIsLocationModalOpen(true)}>
                  <MapPinIcon width={14} />
                  {countryName ? countryName : "Set Location"} <ChevronRightIcon width={14} />
                </div>
                <div className="relative btn btn-primary m-auto px-12 w-full md:w-auto" onClick={handleSubmitPost}>
                  Post Now
                  {loading && <span className="absolute loading loading-ring loading-md ml-1 right-4"></span>}
                </div>
              </div>
            )}
          </div>
        )}
        {isLocationModalOpen && (
          <LocationModal data={countries} onClose={closeLocationModal} onCta={handleSetLocation} />
        )}
      </div>
    </div>
  );
};

export default CreateLong;
