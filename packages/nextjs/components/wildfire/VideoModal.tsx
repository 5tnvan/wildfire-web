import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
  ChatBubbleOvalLeftEllipsisIcon,
  EyeIcon,
  FireIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/20/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, PaperAirplaneIcon, PlayIcon } from "@heroicons/react/24/solid";
import { Src } from "@livepeer/react/*";
import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";
import { useOnClickOutside } from "usehooks-ts";

import { AuthUserContext } from "@/app/context";
import { getLivepeerClient } from "@/utils/livepeer/getLivepeerClient";
import { insertComment } from "@/utils/wildfire/crud/3sec_comments";
import { insertLike } from "@/utils/wildfire/crud/3sec_fires";
import { fetch3Sec } from "@/utils/wildfire/fetch/fetch3Sec";
import { incrementViews } from "@/utils/wildfire/incrementViews";

import { Avatar } from "../Avatar";
import FormatNumber from "./FormatNumber";
import ShareModal from "./ShareModal";
import { TimeAgo } from "./TimeAgo";
import TipModal from "./TipModal";

const VideoModal = ({ data, onClose }: { data: any; onClose: () => void }) => {
  //CONSUME PROVIDERS
  const { profile } = useContext(AuthUserContext);
  //STATES
  const insideRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSource, setVideoSource] = useState<Src[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoStats, setVideoStats] = useState<any>(null);

  const [loopCount, setLoopCount] = useState(0);
  const [likeCount, setLikeCount] = useState<any>();
  const [temporaryLiked, setTemporaryLiked] = useState(false);

  const [commentCount, setCommentCount] = useState<any>();
  const [tempComment, setTempComment] = useState<any>("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [toast, setToast] = useState<any>(null);

  //TIP MODAL
  const [isTipModalOpen, setTipModalOpen] = useState(false);

  useOnClickOutside(insideRef, () => onClose());

  const closeTipModal = () => {
    setTipModalOpen(false);
  };

  //SHARE MODAL
  const [isShareModalOpen, setShareModalOpen] = useState(false);

  const closeShareModal = () => {
    setShareModalOpen(false);
  };

  useEffect(() => {
    (async () => {
      const res = await fetch3Sec(data.id, profile.id);

      if (res) {
        setVideoStats(res);
        setLikeCount(res?.["3sec_fires"]?.[0].count);
        setCommentCount(res?.["3sec_comments"]?.length);
      }

      const livepeer = getLivepeerClient();

      try {
        const playbackResp = await livepeer.playback.get(data.playback_id);
        setVideoSource(getSrc(playbackResp.playbackInfo));
      } catch (error) {
        setIsProcessing(true);
      }
    })();
    handleIncrementViews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id]);

  const handleIncrementViews = async () => {
    incrementViews(data.id);
  };

  //pause video after 3 plays
  const handleVideoEnd = () => {
    if (loopCount < 2) {
      setLoopCount(prevCount => prevCount + 1);
      videoRef.current?.play();
    } else {
      setLoopCount(3);
    }
  };

  const handleWatchAgain = () => {
    setLoopCount(0);
    videoRef.current?.play();
    handleIncrementViews();
  };

  const handleLike = async () => {
    //incr like
    const error = await insertLike(profile.id, data.id);
    if (!error) {
      setTemporaryLiked(true); // Set temporary like state
      setLikeCount((prevCount: any) => prevCount + 1); // Increment like count
    } else {
      console.log("You already liked this post");
      setToast("You already liked this post");

      // Set the toast back to null after 4 seconds
      setTimeout(() => {
        setToast(null);
      }, 3000);
    }
  };

  const toggleComment = () => {
    setShowCommentInput(!showCommentInput);
  };

  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) {
      return; // Do not submit empty comments
    }

    const error = await insertComment(profile.id, data.id, commentInput); // Assuming insertLike handles comments
    if (!error) {
      setTempComment(commentInput); // Store the new comment temporarily
      setCommentCount((prevCount: any) => prevCount + 1); // Increment count
      setCommentInput(""); // Clear the input field
      setShowCommentInput(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col md:flex-row justify-center z-20">
        <div
          onClick={() => onClose()}
          className="btn bg-white hover:bg-white text-black self-start absolute left-2 top-2 z-10"
        >
          <ChevronLeftIcon width={20} color="black" />
          Back
        </div>

        <div ref={insideRef} className="md:flex">
          {isTipModalOpen && <TipModal data={data.profile} video_id={data.id} onClose={closeTipModal} />}
          {isShareModalOpen && <ShareModal data={data.id} onClose={closeShareModal} />}
          {/* TOASTS */}
          {toast && (
            <div className="toast z-20">
              <div className="alert alert-info">
                <span>{toast}</span>
              </div>
            </div>
          )}
          {/* VIDEO PLAYER */}
          <div style={{ width: "56.3dvh" }}>
            {videoSource && (
              <Player.Root src={videoSource} autoPlay>
                <Player.Container>
                  <Player.Video className="rounded-lg" ref={videoRef} onEnded={handleVideoEnd} />

                  <Player.LoadingIndicator className="bg-base-100 h-full w-full flex items-center justify-center">
                    Loading...
                  </Player.LoadingIndicator>

                  <Player.Controls>
                    {loopCount < 3 && (
                      <div className="absolute inset-0 flex justify-center items-center">
                        <Player.PlayPauseTrigger className="h-12 w-12">
                          <Player.PlayingIndicator asChild matcher={false}>
                            <PlayIcon color="white"/>
                          </Player.PlayingIndicator>
                        </Player.PlayPauseTrigger>
                      </div>
                    )}

                    <div className="absolute top-5 right-5">
                      <Player.MuteTrigger className="h-6 w-6">
                        <Player.VolumeIndicator asChild matcher={true}>
                          <SpeakerXMarkIcon color="white" />
                        </Player.VolumeIndicator>
                        <Player.VolumeIndicator asChild matcher={false}>
                          <SpeakerWaveIcon color="white" />
                        </Player.VolumeIndicator>
                      </Player.MuteTrigger>
                    </div>
                  </Player.Controls>

                  {loopCount > 2 && (
                    <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
                      <div className="btn btn-primary text-black opacity-70" onClick={handleWatchAgain}>
                        <EyeIcon width={16} />
                        <span className="font-medium">Watch again</span>
                      </div>
                    </div>
                  )}
                </Player.Container>
              </Player.Root>
            )}

          {isProcessing && (
            <div className="flex justify-center items-center h-full bg-black rounded-md">
              <p className="text-md text-white">Video is still processing. Please check back later.</p>
            </div>
          )}
            
          </div>
          {/* RIGHT PANEL */}
          <div className="hidden md:block video-info self-end ml-2">
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
            <div className="w-full md:w-[350px] h-[300px] bg-base-200 rounded-3xl p-2 flex flex-col shadow">
              <div className="btn btn-primary w-full mb-2" onClick={() => setTipModalOpen(true)}>
                Tip Now
              </div>
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
                    <div className="text-xs opacity-55">just now</div>
                  </div>
                )}
                {videoStats?.["3sec_comments"]
                  ?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // Sort in descending order
                  .map((comment: any, id: number) => (
                    <div key={comment.id || id} className="flex flex-col gap-2 p-3 rounded-full">
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
                  ))}
                {showCommentInput && (
                  <div className="">
                    <textarea
                      className="textarea textarea-primary absolute w-full h-full top-0 rounded-lg"
                      placeholder="Start typing..."
                      value={commentInput}
                      onChange={e => setCommentInput(e.target.value)}
                    ></textarea>
                    <PaperAirplaneIcon
                      width={22}
                      color="orange"
                      className="absolute bottom-3 right-2 hover:opacity-75 cursor-pointer"
                      onClick={() => handleCommentSubmit()}
                    />
                  </div>
                )}
              </div>
              {/* BOTTOM INFO */}
              <div className="flex flex-row gap-2 justify-between mt-2">
                <div className="btn rounded-full flex flex-row justify-center items-center bg-zinc-200 dark:bg-zinc-900 gap-1 grow">
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
                <div className="btn bg-zinc-200 dark:bg-zinc-900" onClick={() => setShareModalOpen(true)}>
                  <PaperAirplaneIcon width={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoModal;
