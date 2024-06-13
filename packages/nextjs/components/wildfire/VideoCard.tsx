import { useEffect, useRef, useState } from "react";
import { Avatar } from "../Avatar";
import FormatNumber from "./FormatNumber";
import { TimeAgo } from "./TimeAgo";
import { ChatBubbleOvalLeftEllipsisIcon, EyeIcon, FireIcon } from "@heroicons/react/20/solid";

const VideoCard = ({ index, data, isPlaying, lastVideoIndex, getVideos }: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadNewVidsAt, setloadNewVidsAt] = useState(lastVideoIndex);

  const handleTogglePlay = () => {
    console.log();
  };

  if (isPlaying) {
    if (loadNewVidsAt === index + 1) {
      setloadNewVidsAt((prev: any) => prev + 2);
      getVideos();
    }
  }

  // Play or pause video based on isPlaying prop
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className="infinite-scroll-item flex flex-row" data-index={index}>
      <div className="video-wrapper">
        <video
          id={index}
          ref={videoRef}
          src={data.video_url}
          className="video rounded-lg"
          onClick={handleTogglePlay}
          muted={true}
          loop
        ></video>
      </div>
      <div className="video-info ml-2 self-end">
        {/* USER INFO */}
        <div className="flex flex-row justify-between items-center mb-7">
          <div className="flex flex-row items-center gap-2">
            <Avatar profile={data.profile} width={10} height={10} />
            <div className="font-semibold text-primary">{data.profile.username}</div>
          </div>
          <TimeAgo timestamp={data.created_at} />
        </div>
        {/* VIDEO INFO */}
        <div className="w-[350px] h-[300px] bg-base-200 rounded-3xl p-2 flex flex-col shadow">
          <div className="btn btn-secondary w-full -mt-7">Tip Now</div>
          {/* COMMENTS */}
          <div className="grow">
            {data["3sec_comments"].length == 0 && (
              <div className="flex flex-row gap-2 items-center justify-center h-full">
                Be first to comment <ChatBubbleOvalLeftEllipsisIcon width={19} />
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
            <div className="btn btn-outline flex flex-row gap-1 grow">
              <EyeIcon width={18} />
              <span className="text-base">
                <FormatNumber number={data["3sec_views"][0]?.view_count} />
              </span>
            </div>
            <div className="btn btn-outline flex flex-row gap-1 grow">
              <FireIcon width={18} />
              <span className="text-base">
                <FormatNumber number={data["3sec_fires"][0]?.count} />
              </span>
            </div>
            <div className=" btn btn-outline flex flex-row gap-1 grow">
              <ChatBubbleOvalLeftEllipsisIcon width={19} />
              <span className="text-base">
                <FormatNumber number={data["3sec_comments"].length} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
