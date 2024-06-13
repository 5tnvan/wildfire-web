import { useEffect, useRef } from "react";

const VideoCard2 = ({ index, author, videoURL, lastVideoIndex, getVideos, isPlaying }: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);

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
    <div className="carousel-item" data-index={index}>
      <video key="index" className="h-screen" ref={videoRef} src={videoURL} muted={true} loop></video>
    </div>
  );
};

export default VideoCard2;
