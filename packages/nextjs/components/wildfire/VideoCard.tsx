import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "../Avatar";
import FormatNumber from "./FormatNumber";
import ShareModal from "./ShareModal";
import { TimeAgo } from "./TimeAgo";
import TipModal from "./TipModal";
import { ChatBubbleOvalLeftEllipsisIcon, EyeIcon, FireIcon, PlayIcon } from "@heroicons/react/20/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { HeartIcon, PaperAirplaneIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";
import { AuthContext, AuthUserContext } from "~~/app/context";
import { useGlobalState } from "~~/services/store/store";
import { convertEthToUsd } from "~~/utils/wildfire/convertEthToUsd";
import { insertComment } from "~~/utils/wildfire/crud/3sec_comments";
import { insertLike } from "~~/utils/wildfire/crud/3sec_fires";
import { incrementViews } from "~~/utils/wildfire/incrementViews";

const VideoCard = ({ index, data, isPlaying, isMuted, feedLength, getVideos, onCtaMute }: any) => {
  const router = useRouter();
  const price = useGlobalState(state => state.nativeCurrency.price);

  //CONSUME PROVIDERS
  const { isAuthenticated } = useContext(AuthContext);
  const { profile } = useContext(AuthUserContext);

  //STATES
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadNewVidsAt, setloadNewVidsAt] = useState(feedLength - 2);
  const [loopCount, setLoopCount] = useState(0);
  const [showWatchAgain, setShowWatchAgain] = useState(false);
  const [showPaused, setShowPaused] = useState(true);
  const [likeCount, setLikeCount] = useState<any>(data["3sec_fires"][0]?.count);
  const [temporaryLiked, setTemporaryLiked] = useState(false);
  const [commentCount, setCommentCount] = useState<any>(data["3sec_comments"]?.length);
  const [tempComment, setTempComment] = useState<any>("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [toast, setToast] = useState<any>(null);

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

  // Toggle mute state globally
  const handleToggleMute = () => {
    onCtaMute(!isMuted);
  };

  //manually pause video
  const handleTogglePlay = () => {
    console.log("clicked");
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

    const error = await insertComment(data.id, commentInput);
    if (!error) {
      setTempComment(commentInput); // Store the new comment temporarily
      setCommentCount((prevCount: any) => prevCount + 1); // Increment count
      setCommentInput(""); // Clear the input field
      setShowCommentInput(false);
    }
  };

  // Calculate total tips in USD
  const totalTipsUsd =
    data["3sec_tips"]?.reduce((acc: number, tip: any) => {
      return acc + convertEthToUsd(tip.amount, price);
    }, 0) || 0;

  //fetch more at last video
  console.log("loadNewVidsAt", loadNewVidsAt);
  if (isPlaying) {
    if (loadNewVidsAt === index) {
      setloadNewVidsAt((prev: any) => prev + 2);
      getVideos();
    }
  }

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
  }, [isPlaying]);

  return (
    <div className="infinite-scroll-item flex flex-col md:flex-row justify-center" data-index={index}>
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
      <div className="video-wrapper relative">
        <video
          id={index}
          ref={videoRef}
          src={data.video_url}
          className="video rounded-lg"
          onEnded={handleVideoEnd}
          muted={isMuted}
        ></video>
        <div className="absolute inset-0 flex m-auto justify-center items-center z-10 h-2/3" onClick={handleTogglePlay}>
          {showPaused && <PlayIcon className="h-16 w-16 text-white" />}
        </div>
        {showWatchAgain && (
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
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
        {/* BOTTOM INFO MOBILE */}
        <div className="flex flex-col md:hidden absolute bottom-0 items-end p-2 w-full z-10">
          <div className="flex flex-row gap-2 justify-between w-full">
            {data["3sec_tips"]?.length > 0 ? (
              <div className="flex flex-row items-top w-full">
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
          </div>
          <div className="flex flex-row gap-2 justify-between w-full">
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
              onClick={isAuthenticated ? () => console.log() : () => router.push("/login")}
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
            {/* {showCommentInput && (
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
            )} */}
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
                    className="text-sm absolute w-5 h-5 top-2.5 right-6 text-blue-600 font-semibold cursor-pointer"
                    onClick={() => handleCommentSubmit()}
                  >
                    Post
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
