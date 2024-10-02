import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useGlobalState } from "@/services/store/store";
import { ChatBubbleOvalLeftEllipsisIcon, EyeIcon, FireIcon, PlayIcon } from "@heroicons/react/20/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { PaperAirplaneIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";

import { convertEthToUsd } from "@/utils/wildfire/convertEthToUsd";
import { incrementViews } from "@/utils/wildfire/incrementViews";

import { Avatar } from "../Avatar";
import FormatNumber from "./FormatNumber";
import ShareModal from "./ShareModal";
import { TimeAgo } from "./TimeAgo";

const VideoCardPreview = ({ index, data, isPlaying, isMuted, feedLength, getVideos, onCtaMute }: any) => {
  const router = useRouter();
  const price = useGlobalState(state => state.nativeCurrency.price);

  //SHARE MODAL
  const [isShareModalOpen, setShareModalOpen] = useState(false);

  const closeShareModal = () => {
    setShareModalOpen(false);
  };

  //STATES
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadNewVidsAt, setloadNewVidsAt] = useState(feedLength - 1);
  const [loopCount, setLoopCount] = useState(0);
  const [showWatchAgain, setShowWatchAgain] = useState(false);
  const [showPaused, setShowPaused] = useState(false);
  const [commentCount] = useState<any>(data["3sec_comments"]?.length);

  // Toggle mute state globally
  const handleToggleMute = () => {
    onCtaMute(!isMuted);
  };

  //manually pause video
  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setShowPaused(false);
      } else {
        videoRef.current.pause();
        setShowPaused(true);
      }
    }
  };

  //pause video after 3 plays
  const handleVideoEnd = () => {
    if (loopCount < 2) {
      setLoopCount(prevCount => prevCount + 1);
      videoRef.current?.play();
    } else {
      setShowWatchAgain(true);
      videoRef.current?.pause();
    }
  };

  const handleWatchAgain = () => {
    setLoopCount(0);
    setShowWatchAgain(false);
    videoRef.current?.play();
    handleIncrementViews();
  };

  const handleIncrementViews = async () => {
    incrementViews(data.id);
  };

  //fetch more
  if (isPlaying) {
    if (loadNewVidsAt === index) {
      setloadNewVidsAt((prev: any) => prev + 2);
      getVideos();
    }
  }

  // Calculate total tips in USD
  const totalTipsUsd =
    data["3sec_tips"]?.reduce((acc: number, tip: any) => {
      return acc + convertEthToUsd(tip.amount, price);
    }, 0) || 0;

  //auto play when video is in view (based on isPlaying)
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        setLoopCount(0);
        setShowWatchAgain(false);
        videoRef.current.play();
        setShowPaused(false);
        handleIncrementViews();
      } else {
        videoRef.current.pause();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  return (
    <div className="infinite-scroll-item flex flex-col md:flex-row justify-center" data-index={index}>
      {isShareModalOpen && <ShareModal data={data.id} onClose={closeShareModal} />}
      <div className="video-wrapper relative">
        <video
          id={index}
          ref={videoRef}
          src={data.video_url}
          className="video"
          onClick={handleTogglePlay}
          onEnded={handleVideoEnd}
          muted={isMuted}
        ></video>
        <div className="absolute inset-0 flex m-auto justify-center items-center z-10 h-2/3" onClick={handleTogglePlay}>
          {showPaused && <PlayIcon className="h-16 w-16 text-white" />}
        </div>
        {showWatchAgain && (
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="btn btn-primary text-black opacity-70" onClick={handleWatchAgain}>
              <EyeIcon width={16} />
              <span className="font-medium">Watch again</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 items-start p-2">
          <Link href={"/" + data.profile.username} className="flex flex-row items-center gap-2">
            <Avatar profile={data.profile} width={10} height={10} />
            <div className="font-semibold text-white">{data.profile.username}</div>
          </Link>
        </div>
        <div className="absolute top-2 right-2">
          <div className=" p-2 text-white" onClick={handleToggleMute}>
            {isMuted ? <SpeakerXMarkIcon width={24} /> : <SpeakerWaveIcon width={24} />}
          </div>
        </div>
        <div className="flex md:hidden absolute bottom-0 items-end p-2 w-full">
          {/* BOTTOM INFO */}
          <div className="flex flex-row gap-2 justify-between w-full">
            <div className="btn bg-zinc-200 dark:bg-zinc-900 flex flex-row gap-1 grow">
              <EyeIcon width={20} />
              <span className="text-base font-normal">
                <FormatNumber number={data["3sec_views"][0]?.view_count} />
              </span>
            </div>
            <div
              className="btn bg-zinc-200 dark:bg-zinc-900 flex flex-row gap-1 grow"
              onClick={() => router.push("/login")}
            >
              <FireIcon width={20} />
              <span className="text-base font-normal">
                <FormatNumber number={data["3sec_fires"][0]?.count} />
              </span>
            </div>
            <div
              className="btn bg-zinc-200 dark:bg-zinc-900 flex flex-row gap-1 grow"
              onClick={() => router.push("/login")}
            >
              <ChatBubbleOvalLeftEllipsisIcon width={20} />
              <span className="text-base font-normal">
                <FormatNumber number={commentCount} />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="video-info hidden md:block ml-2 self-end">
        {/* USER INFO */}
        <div className="flex flex-row justify-between items-center gap-2 mb-2 mx-2">
          <Link href={"/" + data.profile.username} className="flex flex-row items-center gap-2">
            <Avatar profile={data.profile} width={10} height={10} />
            <div className="font-semibold text-primary">{data.profile.username}</div>
          </Link>
          <div className="flex flex-row gap-2">
            {data.country && (
              <div className="flex flex-row gap-1">
                <MapPinIcon width={15} /> <span className="text-sm">{data.country.name}</span>
              </div>
            )}
            <div className="opacity-70 text-sm">
              <TimeAgo timestamp={data.created_at} />
            </div>
          </div>
        </div>
        {/* VIDEO INFO */}
        <div className="w-[350px] h-[300px] bg-base-200 rounded-3xl p-2 flex flex-col shadow">
          {data["3sec_tips"]?.length > 0 ? (
            <div className="flex flex-row items-top">
              <div className="btn btn-primary w-1/2 mb-2" onClick={() => router.push("/login")}>
                Tip Now
              </div>
              <div className="btn bg-base-300 w-1/2 text-sm">${data["3sec_tips"] && totalTipsUsd.toFixed(2)}</div>
            </div>
          ) : (
            <div className="btn btn-primary w-full mb-2" onClick={() => router.push("/login")}>
              Tip Now
            </div>
          )}
          {/* COMMENTS */}
          <div className="grow m-h-[180px] overflow-scroll relative">
            {data["3sec_comments"].length == 0 && (
              <div className="flex flex-row gap-2 items-center justify-center h-full">
                Be first to comment <ChatBubbleOvalLeftEllipsisIcon width={20} />
              </div>
            )}
            {data["3sec_comments"].map((comment: any, id: number) => (
              <>
                <div key={id} className="flex flex-col gap-2 p-3 rounded-full">
                  <div className="flex flex-row gap-2 justify-between items-center">
                    <Link href={"/" + comment.profile.username} className="flex flex-row gap-1">
                      <Avatar profile={comment.profile} width={6} height={6} />
                      <span className="text-sm">{comment.profile.username}</span>
                    </Link>
                    <div className="text-xs opacity-55">
                      <TimeAgo timestamp={comment.created_at} />
                    </div>
                  </div>
                  <div className="text-sm opacity-75">{comment.comment}</div>
                </div>
              </>
            ))}
          </div>
          {/* BOTTOM INFO */}
          <div className="flex flex-row gap-2 justify-betwee mt-2">
            <div className="btn bg-zinc-200 dark:bg-zinc-900 flex flex-row gap-1 grow">
              <EyeIcon width={20} />
              <span className="text-base font-normal">
                <FormatNumber number={data["3sec_views"][0]?.view_count} />
              </span>
            </div>
            <div
              className="btn bg-zinc-200 dark:bg-zinc-900 flex flex-row gap-1 grow"
              onClick={() => router.push("/login")}
            >
              <FireIcon width={20} />
              <span className="text-base font-normal">
                <FormatNumber number={data["3sec_fires"][0]?.count} />
              </span>
            </div>
            <div
              className="btn bg-zinc-200 dark:bg-zinc-900 flex flex-row gap-1 grow"
              onClick={() => router.push("/login")}
            >
              <ChatBubbleOvalLeftEllipsisIcon width={20} />
              <span className="text-base font-normal">
                <FormatNumber number={commentCount} />
              </span>
            </div>
            <div className="btn bg-zinc-200 dark:bg-zinc-900" onClick={() => setShareModalOpen(true)}>
              <PaperAirplaneIcon width={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCardPreview;
