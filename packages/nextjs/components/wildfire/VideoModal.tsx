import React, { useRef, useState } from "react";
import { Avatar } from "../Avatar";
import FormatNumber from "./FormatNumber";
import { TimeAgo } from "./TimeAgo";
import { ChatBubbleOvalLeftEllipsisIcon, EyeIcon, FireIcon, PlayIcon } from "@heroicons/react/20/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

const VideoModal = ({ data, onClose }: { data: any; onClose: () => void }) => {
  console.log("video data", data);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loopCount, setLoopCount] = useState(0);
  const [showWatchAgain, setShowWatchAgain] = useState(false);
  const [showPaused, setShowPaused] = useState(false);

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div onClick={onClose} className="btn bg-white hover:bg-white text-black self-start absolute left-2 top-2">
        <ChevronLeftIcon width={20} color="black" />
        Back
      </div>
      {/* video */}
      <div className="relative">
        <video
          src={data.video_url}
          ref={videoRef}
          autoPlay
          className="w-auto h-screen rounded-lg"
          onClick={handleTogglePlay}
          onEnded={handleVideoEnd}
        />
        {showWatchAgain && (
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div
              className="btn btn-primary text-black opacity-70"
              onClick={() => {
                setLoopCount(0);
                setShowWatchAgain(false);
                videoRef.current?.play();
              }}
            >
              <EyeIcon width={16} />
              <span className="font-medium">Watch again</span>
            </div>
          </div>
        )}
        {showPaused && (
          <div
            className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-30"
            onClick={handleTogglePlay}
          >
            <PlayIcon className="h-16 w-16 text-white" />
          </div>
        )}
      </div>

      <div className="video-info ml-2 self-end">
        {/* USER INFO */}
        <div className="flex flex-row justify-between items-center gap-2 mb-2 mx-2">
          <div className="flex flex-row items-center gap-2">
            <Avatar profile={data.profile} width={10} height={10} />
            <div className="font-semibold text-primary">{data.profile.username}</div>
          </div>
          <div className="flex flex-row gap-2">
            {data.country && (
              <div className="flex flex-row gap-1">
                <MapPinIcon width={15} color="white" /> <span className="text-sm text-white">{data.country.name}</span>
              </div>
            )}
            <div className="text-sm text-zinc-400">
              <TimeAgo timestamp={data.created_at} />
            </div>
          </div>
        </div>
        {/* VIDEO INFO */}
        <div className="w-[350px] h-[300px] bg-base-200 rounded-3xl p-2 flex flex-col shadow">
          <div className="btn btn-primary w-full mb-2">Tip Now</div>
          {/* COMMENTS */}
          <div className="grow m-h-[180px] overflow-scroll">
            {data["3sec_comments"].length == 0 && (
              <div className="flex flex-row gap-2 items-center justify-center h-full">
                Be first to comment <ChatBubbleOvalLeftEllipsisIcon width={20} />
              </div>
            )}
            {data["3sec_comments"].map((comment: any, id: number) => (
              <div key={id} className="flex flex-row gap-2 mb-2 p-3 rounded-full items-center">
                <div className="flex flex-row items-center gap-1">
                  <Avatar profile={comment.profile} width={6} height={6} />
                  <span className="text-sm">{comment.profile.username}</span>
                </div>
                <div className="text-sm opacity-50">{comment.comment}</div>
              </div>
            ))}
          </div>
          {/* BOTTOM INFO */}
          <div className="flex flex-row gap-2 justify-between">
            <div className="btn bg-zinc-200 dark:bg-zinc-900 flex flex-row gap-1 grow">
              <EyeIcon width={20} />
              <span className="text-base font-normal">
                <FormatNumber number={data["3sec_views"][0]?.view_count} />
              </span>
            </div>
            <div className="btn bg-zinc-200 dark:bg-zinc-900 flex flex-row gap-1 grow">
              <FireIcon width={20} />
              <span className="text-base font-normal">
                <FormatNumber number={data["3sec_fires"][0]?.count} />
              </span>
            </div>
            <div className="btn bg-zinc-200 dark:bg-zinc-900 flex flex-row gap-1 grow">
              <ChatBubbleOvalLeftEllipsisIcon width={20} />
              <span className="text-base font-normal">
                <FormatNumber number={data["3sec_comments"].length} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
