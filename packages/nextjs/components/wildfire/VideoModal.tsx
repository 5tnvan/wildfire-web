import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Avatar } from "../Avatar";
import FormatNumber from "./FormatNumber";
import { TimeAgo } from "./TimeAgo";
import { ChatBubbleOvalLeftEllipsisIcon, EyeIcon, FireIcon, PlayIcon } from "@heroicons/react/20/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { AuthUserContext } from "~~/app/context";
import { insertComment } from "~~/utils/wildfire/crud/3sec_comments";
import { insertLike } from "~~/utils/wildfire/crud/3sec_fires";
import { fetch3Sec } from "~~/utils/wildfire/fetch/fetch3Sec";

const VideoModal = ({ data, onClose }: { data: any; onClose: () => void }) => {
  const { profile } = useContext(AuthUserContext);
  //STATES
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStats, setVideoStats] = useState<any>(null);
  const [loopCount, setLoopCount] = useState(0);
  const [showWatchAgain, setShowWatchAgain] = useState(false);
  const [showPaused, setShowPaused] = useState(false);

  const [likeCount, setLikeCount] = useState<any>();
  const [temporaryLiked, setTemporaryLiked] = useState(false);

  const [commentCount, setCommentCount] = useState<any>();
  const [tempComment, setTempComment] = useState<any>("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    async function fetchData() {
      const res = await fetch3Sec(data.id, profile.id);
      if (res) {
        setVideoStats(res);
        setLikeCount(res?.["3sec_fires"]?.[0].count);
        setCommentCount(res?.["3sec_comments"]?.length);
      }
    }
    fetchData();
  }, [data.id]);

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

  console.log("videoStats", videoStats);

  const handleLike = async () => {
    if (videoStats.liked) {
      return;
    } else {
      console.log("im here");
      //incr like
      const error = await insertLike(data.id);
      console.log("err", error);
      if (!error) {
        console.log("im hereeee");
        setTemporaryLiked(true); // Set temporary like state
        setLikeCount((prevCount: any) => prevCount + 1); // Increment like count
      }
    }
  };

  const toggleComment = () => {
    setShowCommentInput(!showCommentInput);
  };

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) {
      return; // Do not submit empty comments
    }

    const error = await insertComment(data.id, commentInput); // Assuming insertLike handles comments
    if (!error) {
      setTempComment(commentInput); // Store the new comment temporarily
      setCommentCount((prevCount: any) => prevCount + 1); // Increment count
      setCommentInput(""); // Clear the input field
      setShowCommentInput(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div onClick={handleClose} className="btn bg-white hover:bg-white text-black self-start absolute left-2 top-2">
          <ChevronLeftIcon width={20} color="black" />
          Back
        </div>
        {/* VIDEO PLAYER */}
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
        {/* RIGHT PANEL */}
        <div className="video-info ml-2 self-end">
          {/* USER LOCATION TIME */}
          <div className="flex flex-row justify-between items-center gap-2 mb-2 mx-2">
            <Link href={`/${data.profile.username}`} className="flex flex-row items-center gap-2">
              <Avatar profile={data.profile} width={10} height={10} />
              <div className="font-semibold text-primary">{data.profile.username}</div>
            </Link>
            <div className="flex flex-row gap-2">
              {data.country && (
                <div className="flex flex-row gap-1">
                  <MapPinIcon width={15} color="white" />{" "}
                  <span className="text-sm text-white">{data.country.name}</span>
                </div>
              )}
              <div className="text-sm text-zinc-400">
                <TimeAgo timestamp={data.created_at} />
              </div>
            </div>
          </div>
          {/* VIEW LIKES COMMENTS */}
          <div className="w-[350px] h-[300px] bg-base-200 rounded-3xl p-2 flex flex-col shadow">
            <div className="btn btn-primary w-full mb-2">Tip Now</div>
            {/* COMMENTS */}
            <div className="grow m-h-[180px] overflow-scroll relative">
              {/* If no comments yet */}
              {videoStats?.["3sec_comments"]?.length == 0 && !tempComment && (
                <div className="flex flex-row gap-2 items-center justify-center h-full">
                  Be first to comment <ChatBubbleOvalLeftEllipsisIcon width={20} />
                </div>
              )}
              {/* Render tempComment if it exists */}
              {tempComment && (
                <div className="flex flex-row gap-2 mb-2 p-3 rounded-full items-center">
                  <div className="flex flex-row items-center gap-1">
                    <Avatar profile={profile} width={6} height={6} />
                    <span className="text-sm">{profile.username}</span>
                  </div>
                  <div className="text-sm opacity-50">{tempComment}</div>
                </div>
              )}
              {videoStats?.["3sec_comments"]?.map((comment: any, id: number) => (
                <div key={id} className="flex flex-row gap-2 mb-2 p-3 rounded-full items-center">
                  <div className="flex flex-row items-center gap-1">
                    <Avatar profile={comment.profile} width={6} height={6} />
                    <span className="text-sm">{comment.profile.username}</span>
                  </div>
                  <div className="text-sm opacity-50">{comment.comment}</div>
                </div>
              ))}
              {/* Comment Input */}
              {showCommentInput && (
                <div>
                  <textarea
                    className="textarea textarea-primary absolute w-full h-full top-0 rounded-lg"
                    placeholder="Start typing..."
                    value={commentInput}
                    onChange={e => setCommentInput(e.target.value)}
                  ></textarea>
                  <PaperAirplaneIcon
                    width={22}
                    color="orange"
                    className="absolute bottom-2 right-2 hover:opacity-75 cursor-pointer"
                    onClick={() => handleCommentSubmit()}
                  />
                </div>
              )}
            </div>
            {/* BOTTOM INFO */}

            <div className="flex flex-row gap-2 justify-between">
              <div className="rounded-full flex flex-row justify-center items-center bg-zinc-200 dark:bg-zinc-900 gap-1 grow">
                <EyeIcon width={20} />
                <span className="text-base font-normal">
                  <FormatNumber number={videoStats?.["3sec_views"][0]?.view_count} />
                </span>
              </div>

              <div className="btn bg-zinc-200 dark:bg-zinc-900 flex flex-row gap-1 grow" onClick={handleLike}>
                {(videoStats?.liked || temporaryLiked) == true ? (
                  <FireIcon width={20} color="red" />
                ) : (
                  <FireIcon width={20} />
                )}

                <span className={`text-base font-normal`}>
                  <FormatNumber number={likeCount} />
                </span>
              </div>

              <div className="btn bg-zinc-200 dark:bg-zinc-900 flex flex-row gap-1 grow" onClick={toggleComment}>
                <ChatBubbleOvalLeftEllipsisIcon width={20} />
                <span className="text-base font-normal">
                  <FormatNumber number={commentCount} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoModal;
