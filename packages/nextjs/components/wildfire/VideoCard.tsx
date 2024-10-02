import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useGlobalState } from "@/services/store/store";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  EyeIcon,
  FireIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/20/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { HeartIcon, PaperAirplaneIcon, PlayIcon } from "@heroicons/react/24/solid";
import { Src } from "@livepeer/react/*";
import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";

import { AuthContext, AuthUserContext } from "@/app/context";
import { getLivepeerClient } from "@/utils/livepeer/getLivepeerClient";
import { convertEthToUsd } from "@/utils/wildfire/convertEthToUsd";
import { insertComment } from "@/utils/wildfire/crud/3sec_comments";
import { insertLike } from "@/utils/wildfire/crud/3sec_fires";
import { incrementViews } from "@/utils/wildfire/incrementViews";

import { Avatar } from "../Avatar";
import FormatNumber from "./FormatNumber";
import ShareModal from "./ShareModal";
import { TimeAgo } from "./TimeAgo";
import TipModal from "./TipModal";

const VideoCard = ({ index, data, isPlaying, isMuted, feedLength, getVideos, onCtaMute }: any) => {
  const router = useRouter();
  const price = useGlobalState(state => state.nativeCurrency.price);

  //CONSUME PROVIDERS
  const { isAuthenticated, user } = useContext(AuthContext);
  const { profile } = useContext(AuthUserContext);

  //STATES
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSource, setVideoSource] = useState<Src[] | null>(null);
  const [loadNewVidsAt, setloadNewVidsAt] = useState(feedLength - 2);
  const [loopCount, setLoopCount] = useState(0);
  const [likeCount, setLikeCount] = useState<any>(data["3sec_fires"][0]?.count);
  const [temporaryLiked, setTemporaryLiked] = useState(false);
  const [commentCount, setCommentCount] = useState<any>(data["3sec_comments"]?.length);
  const [tempComment, setTempComment] = useState<any>("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  //TIP MODAL
  const [isTipModalOpen, setTipModalOpen] = useState(false);

  const closeTipModal = () => {
    setTipModalOpen(false);
  };

  //SHARE MODAL
  const [isShareModalOpen, setShareModalOpen] = useState(false);

  const closeShareModal = () => {
    setShareModalOpen(false);
  };

  const handleIncrementViews = async () => {
    await incrementViews(data.id);
  };

  const handleLike = async () => {
    //incr like
    const error = await insertLike(user?.id, data.id);
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
    setLoadingComment(true);
    const error = await insertComment(user?.id, data.id, commentInput);
    if (!error) {
      setTempComment(commentInput); // Store the new comment temporarily
      setCommentCount((prevCount: any) => prevCount + 1); // Increment count
      setCommentInput(""); // Clear the input field
      setShowCommentInput(false);
      setLoadingComment(false);
    }
  };

  // Calculate total tips in USD
  const totalTipsUsd =
    data["3sec_tips"]?.reduce((acc: number, tip: any) => {
      return acc + convertEthToUsd(tip.amount, price);
    }, 0) || 0;

  useEffect(() => {
    (async () => {
      const livepeer = getLivepeerClient();

      const playbackResp = await livepeer.playback.get(data.playback_id);
      setVideoSource(getSrc(playbackResp.playbackInfo));
    })();
  }, [data]);

  //auto play when video is in view (based on isPlaying)
  useEffect(() => {
    if (videoRef.current) {
      console.log("loadNewVidsAt", loadNewVidsAt);

      if (isPlaying) {
        setLoopCount(0);
        videoRef.current.play();
        handleIncrementViews();

        if (loadNewVidsAt === index) {
          setloadNewVidsAt((prev: any) => prev + 2);
          getVideos();
        }
      } else {
        setLoopCount(0);
        videoRef.current.pause();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, videoRef.current]);

  const handleToggleMute = () => {
    onCtaMute();
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

  return (
    <div
      className="carousel-item flex flex-col md:flex-row justify-center"
      data-index={index}
      style={{ height: "88dvh" }}
    >
      {/* MODAL */}
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

      {/* VIDEO WRAPPER */}
      <div style={{ width: "49.4dvh" }}>
        {videoSource && (
          <Player.Root src={videoSource}>
            <Player.Container>
              <Player.Video className="rounded-lg" muted={isMuted} ref={videoRef} onEnded={handleVideoEnd} />

              <Player.LoadingIndicator className="bg-base-100 h-full w-full flex items-center justify-center">
                Loading...
              </Player.LoadingIndicator>

              <Player.Controls>
                {loopCount < 3 && (
                  <div className="absolute inset-0 flex justify-center items-center">
                    <Player.PlayPauseTrigger className="h-12 w-12">
                      <Player.PlayingIndicator asChild matcher={false}>
                        <PlayIcon color="white" />
                      </Player.PlayingIndicator>
                    </Player.PlayPauseTrigger>
                  </div>
                )}
              </Player.Controls>

              <div className="absolute top-2 left-2 right-2 flex flex-row justify-between items-center">
                <Link href={"/" + data.profile.username} className="flex flex-row items-center gap-2">
                  <Avatar profile={data.profile} width={10} height={10} />
                  <div className="font-semibold text-white">{data.profile.username}</div>
                </Link>

                <button className="order-last text-white" onClick={handleToggleMute}>
                  {isMuted ? <SpeakerXMarkIcon width={24} /> : <SpeakerWaveIcon width={24} />}
                </button>
              </div>

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
      </div>

      {/* INFO BLOCK ON THE RIGHT */}
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
        {/* THE REST */}
        <div className="w-[350px] h-[350px] bg-base-200 rounded-3xl p-2 flex flex-col shadow">
          {/* TIP NOW */}
          {data["3sec_tips"]?.length > 0 ? (
            <div className="flex flex-row items-top">
              <div
                className="btn btn-primary w-1/2 mb-2"
                onClick={isAuthenticated ? () => setTipModalOpen(true) : () => router.push("/login")}
              >
                Tip Now
              </div>
              <div className="btn bg-base-300 w-1/2 text-sm">
                <HeartIcon width={14} />${data["3sec_tips"] && totalTipsUsd.toFixed(2)}
              </div>
            </div>
          ) : (
            <div
              className="btn btn-primary w-full mb-2"
              onClick={isAuthenticated ? () => setTipModalOpen(true) : () => router.push("/login")}
            >
              Tip Now
            </div>
          )}
          {/* COMMENTS */}
          <div className="grow m-h-[180px] overflow-scroll relative">
            {/* Render individual tips */}
            {data["3sec_tips"] &&
              data["3sec_tips"].map((tip: any, id: number) => (
                <div
                  key={tip.id + tip.transaction_hash + id}
                  className="flex flex-row rounded-full items-center gap-2 px-3 pl-0 justify-between"
                >
                  <Link
                    href={`https://www.wildpay.app/transaction/payment/${
                      tip.network === 84532 || tip.network === 8453
                        ? "base"
                        : tip.network === 11155111 || tip.network === 1
                        ? "ethereum"
                        : ""
                    }/${tip.transaction_hash}`}
                    className="px-4 py-2 rounded-3xl flex flex-row items-center gap-2 mb-1 bg-base-100"
                    target="_blank"
                  >
                    <div className="w-[20px] h-[20px]">
                      <Avatar profile={tip.tipper} width={6} height={6} />
                    </div>
                    <span className="text-sm font-semibold">tipped</span>
                    <div className="badge badge-primary">${convertEthToUsd(tip.amount, price)}</div>
                    <span className="text-sm">{tip.comment}</span>
                  </Link>
                  <div className="text-xs opacity-55">
                    <TimeAgo timestamp={tip.created_at} />
                  </div>
                </div>
              ))}
            {/* Render be first to comment */}
            {data["3sec_comments"].length == 0 && !tempComment && (
              <div className="flex flex-row gap-2 items-center justify-center h-full">
                Be first to comment <ChatBubbleOvalLeftEllipsisIcon width={20} />
              </div>
            )}
            {/* Render tempComment if it exists */}
            {tempComment && (
              <div className="flex flex-col gap-2 p-3 rounded-full">
                <div className="flex flex-row gap-2 justify-between items-center">
                  <div className="flex flex-row items-center gap-1">
                    <Avatar profile={profile} width={6} height={6} />
                    <span className="text-sm">{profile.username}</span>
                  </div>
                  <div className="text-xs opacity-55">just now</div>
                </div>
                <div className="text-sm opacity-50">{tempComment}</div>
              </div>
            )}
            {/* Render comments */}
            {data["3sec_comments"]
              .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // Sort in descending order
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
                  className="absolute bottom-2 right-2 hover:opacity-75 cursor-pointer"
                  onClick={() => handleCommentSubmit()}
                />
              </div>
            )}
          </div>
          {/* Comment input */}
          {isAuthenticated && (
            <div className="w-full max-w-sm min-w-[200px] mt-2">
              <div className="relative w-full pl-3 pr-10 py-2 bg-transparent border border-slate-200 rounded-full transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow">
                <div className="absolute top-2.5 left-2.5">
                  <Avatar profile={profile} width={5} height={5} />
                </div>
                <input
                  type="text"
                  className="ml-6 mr-12 bg-transparent placeholder:text-slate-400 text-slate-600 dark:text-slate-300 text-sm"
                  style={{ width: "87%" }}
                  placeholder="Type your comment..."
                  value={commentInput}
                  onChange={e => setCommentInput(e.target.value)}
                  maxLength={100}
                />
                {commentInput.length > 0 && (
                  <div
                    className="text-sm absolute w-fit h-5 top-2.5 right-6 text-blue-600 font-semibold cursor-pointer flex flex-row items-center"
                    onClick={() => handleCommentSubmit()}
                  >
                    <span>Post</span>
                    {loadingComment && <span className="loading loading-ring loading-xs ml-1"></span>}
                  </div>
                )}
                {/* <FaceSmileIcon width={30} color="black" className="absolute w-5 h-5 top-2.5 right-2.5 text-slate-600" /> */}
              </div>
            </div>
          )}
          {/* BOTTOM: VIEWS & LIKES & COMMENTS COUNT */}
          <div className="flex flex-row gap-2 justify-between mt-2">
            <div className="btn bg-zinc-200 dark:bg-zinc-900 flex flex-row gap-1 grow">
              <EyeIcon width={20} />
              <span className="text-base font-normal">
                <FormatNumber number={data["3sec_views"][0]?.view_count} />
              </span>
            </div>
            <div
              className="btn bg-zinc-200 dark:bg-zinc-900 flex flex-row gap-1 grow"
              onClick={isAuthenticated ? handleLike : () => router.push("/login")}
            >
              {(data.liked || temporaryLiked) && <FireIcon width={20} color="red" />}
              {!data.liked && !temporaryLiked && <FireIcon width={20} />}
              <span className="text-base font-normal">
                <FormatNumber number={likeCount} />
              </span>
            </div>
            <div
              className="btn bg-zinc-200 dark:bg-zinc-900 flex flex-row gap-1 grow"
              onClick={isAuthenticated ? toggleComment : () => router.push("/login")}
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

export default VideoCard;
