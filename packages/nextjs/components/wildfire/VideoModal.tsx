import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "../Avatar";
import FormatNumber from "./FormatNumber";
import ShareModal from "./ShareModal";
import { TimeAgo } from "./TimeAgo";
import TipModal from "./TipModal";
import { ChatBubbleOvalLeftEllipsisIcon, EyeIcon, FireIcon, PlayIcon } from "@heroicons/react/20/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";
import {
  ChatBubbleLeftEllipsisIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  HeartIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { AuthContext, AuthUserContext } from "~~/app/context";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { livepeerClient } from "~~/utils/livepeer/livepeer";
import { convertEthToUsd } from "~~/utils/wildfire/convertEthToUsd";
import { insertComment } from "~~/utils/wildfire/crud/3sec_comments";
import { insertLike } from "~~/utils/wildfire/crud/3sec_fires";
import { insertReply } from "~~/utils/wildfire/crud/3sec_replies";
import { fetch3Sec } from "~~/utils/wildfire/fetch/fetch3Sec";
import { incrementViews } from "~~/utils/wildfire/incrementViews";

const VideoModal = ({ data, onClose }: { data: any; onClose: () => void }) => {
  const router = useRouter();
  const ethPrice = useGlobalState(state => state.nativeCurrency.price);
  const fusePrice = useGlobalState(state => state.fuseCurrency.price);

  //CONSUME PROVIDERS
  const { isAuthenticated } = useContext(AuthContext);
  const { profile } = useContext(AuthUserContext);

  //STATES
  const insideRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  //const [videoStats, setVideoStats] = useState<any>(null);
  const [loopCount, setLoopCount] = useState(0);
  const [showWatchAgain, setShowWatchAgain] = useState(false);
  const [showPaused, setShowPaused] = useState(false);

  const [likeCount, setLikeCount] = useState<any>();
  const [temporaryLiked, setTemporaryLiked] = useState(false);

  const [commentCount, setCommentCount] = useState<any>();
  const [tempComment, setTempComment] = useState<any>("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [toast, setToast] = useState<any>(null);

  const [loadingComment, setLoadingComment] = useState(false);
  const [replyButton, setReplyButton] = useState<null | string>(null); //comment id
  const [replyInput, setReplyInput] = useState("");
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [tempReply, setTempReply] = useState<{ text: string; commentId: string } | null>(null);

  const [playbackInfo, setPlaybackInfo] = useState<any>(null);

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

  useOutsideClick(insideRef, () => {
    handleClose();
  });

  useEffect(() => {
    async function fetchData() {
      const res = await fetch3Sec(data.id, profile.id);
      if (res) {
        //setVideoStats(res);
        setLikeCount(res?.["3sec_fires"]?.[0].count);
        //setCommentCount(res?.["3sec_comments"]?.length);
      }
    }
    fetchData();
    handleIncrementViews();
  }, [data.id]);

  //comment count
  useEffect(() => {
    if (data["3sec_comments"]) {
      const totalCommentCount = data["3sec_comments"].reduce((count: number, comment: any) => {
        const repliesCount = comment["3sec_replies"]?.length || 0;
        return count + 1 + repliesCount; // 1 for the main comment + number of replies
      }, 0);

      setCommentCount(totalCommentCount);
    }
  }, [data]);

  const handleWatchAgain = () => {
    setLoopCount(0);
    setShowWatchAgain(false);
    videoRef.current?.play();
    handleIncrementViews();
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

  const handleIncrementViews = async () => {
    incrementViews(data.id);
  };

  const handleLike = async () => {
    //incr like
    const error = await insertLike(data.id);
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

    const error = await insertComment(data.id, commentInput); // Assuming insertLike handles comments
    if (!error) {
      setTempComment(commentInput); // Store the new comment temporarily
      setCommentCount((prevCount: any) => prevCount + 1); // Increment count
      setCommentInput(""); // Clear the input field
      setShowCommentInput(false);
    }
  };

  const toggleShowReplies = (commentId: string) => {
    // Toggle replies for the specific commentId
    if (replyButton === commentId) {
      setShowReplies(!showReplies); // Toggle if same commentId
    } else {
      setReplyButton(commentId); // Set new commentId
      setShowReplies(true); // Show replies for new comment
    }
  };

  const handleReply = (comment_id: string) => {
    if (replyButton == comment_id) {
      setReplyButton(null);
    } else {
      setReplyButton(comment_id);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyInput.trim() || !replyButton) {
      return; // Do not submit empty comments or if there's no comment ID
    }
    setLoadingComment(true);
    const error = await insertReply(replyButton, replyInput);
    if (!error) {
      setTempReply({ text: replyInput, commentId: replyButton }); // Store the new comment temporarily
      setCommentCount((prevCount: any) => prevCount + 1); // Increment count
      setReplyInput(""); // Clear the input field
      setLoadingComment(false);
      setShowReplies(true);
    }
  };

  const handleClose = () => {
    onClose();
  };

  // Calculate total tips in USD
  const totalTipsUsd =
    data["3sec_tips"]?.reduce((acc: number, tip: any) => {
      const applicablePrice = tip.network === 122 ? fusePrice : ethPrice;
      return acc + convertEthToUsd(tip.amount, applicablePrice);
    }, 0) || 0;

  // Fetch playback info from playback_id
  useEffect(() => {
    const fetchPlaybackInfo = async () => {
      try {
        console.log("playback_id", data.playback_id);
        const info = await livepeerClient.playback.get(data.playback_id);
        setPlaybackInfo(info.playbackInfo?.meta.source[0].url); // Set the playback info state
      } catch (error) {
        console.error("Error fetching playback info:", error);
        setPlaybackInfo("error");
      }
    };

    if (data.playback_id) {
      fetchPlaybackInfo();
    }
  }, [data.playback_id]);

  console.log("playbackInfo", playbackInfo);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col md:flex-row items-center justify-center z-50">
        <div
          onClick={handleClose}
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
          <div className="relative">
            {playbackInfo == "error" ? (
              <div className="bg-black w-full h-screen p-10 rounded-lg text-white flex flex-row items-center">
                Video is processing. Please come back later.
              </div>
            ) : (
              <video
                src={playbackInfo}
                ref={videoRef}
                autoPlay
                className="w-auto h-screen rounded-lg"
                onClick={handleTogglePlay}
                onEnded={handleVideoEnd}
                controls={false}
              />
            )}
            {showWatchAgain && (
              <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div className="btn btn-primary text-black opacity-70" onClick={handleWatchAgain}>
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
                    Send Love
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
                  Send Love
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
                        href={`https://www.kinnectwallet.com/transaction/payment/${
                          tip.network === 84532 || tip.network === 8453
                            ? "base"
                            : tip.network === 11155111 || tip.network === 1
                            ? "ethereum"
                            : tip.network === 122
                            ? "fuse"
                            : ""
                        }/${tip.transaction_hash}`}
                        className="px-4 py-2 rounded-3xl flex flex-row items-center gap-2 mb-1 bg-base-100"
                        target="_blank"
                      >
                        <div className="w-[20px] h-[20px]">
                          <Avatar profile={tip.tipper} width={6} height={6} />
                        </div>
                        <span className="text-sm font-semibold">sent love</span>
                        <div className="badge badge-primary">
                          ${convertEthToUsd(tip.amount, tip.network === 122 ? fusePrice : ethPrice)}
                        </div>
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
                        <span className="text-sm font-semibold">{profile.username}</span>
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
                    <div key={comment.id || id} className="flex flex-col gap-3 p-3 rounded-full">
                      <div className="flex flex-row gap-2 justify-between items-center">
                        <Link
                          href={"/" + comment.profile.username}
                          className="flex flex-row gap-1 justify-between items-center"
                        >
                          <Avatar profile={comment.profile} width={6} height={6} />
                          <span className="text-xs font-semibold">{comment.profile.username}</span>
                        </Link>
                        <div className="text-xs opacity-55">
                          <TimeAgo timestamp={comment.created_at} />
                        </div>
                      </div>
                      <div className="text-sm">{comment.comment}</div>
                      <div className="text-xs flex flex-row gap-5 mt-2">
                        {/* <div className="flex flex-row gap-1 cursor-pointer" onClick={() => handleLikeComment()}>
                      <HeartIcon width={15} />
                      Like
                    </div> */}
                        <div
                          className={`cursor-pointer ${
                            replyButton !== null && replyButton == comment.id && "text-primary block"
                          } flex flex-row items-center justify-center gap-1`}
                          onClick={() => handleReply(comment.id)}
                        >
                          <ChatBubbleLeftEllipsisIcon width={18} height={18} />
                          Reply
                          <div className={replyButton !== null && replyButton == comment.id ? "block" : "hidden"}>
                            <XMarkIcon width={10} height={10} />
                          </div>
                        </div>
                      </div>
                      {/* Render replies */}
                      {comment["3sec_replies"] && comment["3sec_replies"].length > 0 && (
                        <>
                          <div
                            className="cursor-pointer text-sm text-blue-400 flex flex-row items-center gap-1"
                            onClick={() => toggleShowReplies(comment.id)}
                          >
                            <ChevronDownIcon width={20} height={20} />
                            {comment["3sec_replies"].length}{" "}
                            {comment["3sec_replies"].length === 1 ? "reply" : "replies"}
                          </div>

                          {showReplies && replyButton === comment.id && (
                            <div className="ml-4">
                              {comment["3sec_replies"]
                                .filter((reply: any) => reply.comment_id === comment.id) // Show only replies for this comment
                                .sort(
                                  (a: any, b: any) =>
                                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
                                )
                                .map((reply: any, index: number) => (
                                  <div key={reply.id || index} className="text-sm p-1">
                                    <div className="flex items-center gap-1">
                                      <a
                                        href={`/${reply.profile.username}`}
                                        className="flex flex-row items-center gap-1"
                                      >
                                        <Avatar profile={reply.profile} width={6} height={6} />
                                        <span className="text-xs font-semibold">{reply.profile.username}</span>
                                      </a>
                                      <div className="text-xs">{reply.reply}</div>
                                      <span className="text-xs">
                                        <TimeAgo timestamp={reply.created_at} />
                                      </span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </>
                      )}

                      {/* temporary reply */}
                      {tempReply !== null && tempReply.commentId === comment.id && (
                        <div className="text-sm p-1 ml-4">
                          <div className="flex items-center gap-1">
                            <div className="flex flex-row items-center gap-1">
                              <Avatar profile={profile} width={6} height={6} />
                              <span className="text-xs font-semibold">{profile.username}</span>
                            </div>
                            <div className="text-xs">{tempReply.text}</div>
                            <span className="text-xs">now</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
              {/* Comment input */}
              {isAuthenticated && (
                <div className="w-full max-w-sm min-w-[200px] mt-2">
                  <div className="relative w-full pl-3 pr-10 py-2 bg-transparent border border-slate-200 rounded-full transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow">
                    <div className="absolute top-2.5 left-2.5">
                      <Avatar profile={profile} width={5} height={5} />
                    </div>
                    {replyButton !== null ? (
                      <input
                        type="text"
                        className="ml-6 mr-12 bg-transparent placeholder:text-slate-400 text-slate-600 dark:text-slate-300 text-sm"
                        style={{ width: "87%" }}
                        placeholder="Type your reply..."
                        value={replyInput}
                        onChange={e => setReplyInput(e.target.value)}
                        maxLength={100}
                      />
                    ) : (
                      <input
                        type="text"
                        className="ml-6 mr-12 bg-transparent placeholder:text-slate-400 text-slate-600 dark:text-slate-300 text-sm"
                        style={{ width: "87%" }}
                        placeholder="Type your comment..."
                        value={commentInput}
                        onChange={e => setCommentInput(e.target.value)}
                        maxLength={100}
                      />
                    )}

                    {commentInput.length > 0 && (
                      <div
                        className="text-sm absolute w-fit h-5 top-2.5 right-6 text-blue-600 font-semibold cursor-pointer flex flex-row items-center"
                        onClick={() => handleCommentSubmit()}
                      >
                        <span>Post</span>
                        {loadingComment && <span className="loading loading-ring loading-xs ml-1"></span>}
                      </div>
                    )}
                    {replyInput.length > 0 && (
                      <div
                        className="text-sm absolute w-fit h-5 top-2.5 right-6 text-blue-600 font-semibold cursor-pointer flex flex-row items-center"
                        onClick={() => handleReplySubmit()}
                      >
                        <span>Post</span>
                        {loadingComment && <span className="loading loading-ring loading-xs ml-1"></span>}
                      </div>
                    )}
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
      </div>
    </>
  );
};

export default VideoModal;
