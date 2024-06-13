import React, { useEffect, useRef } from 'react';

const InfiniteScrollItem = ({ item, isPlaying }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className="video-item">
      <Video
        ref={videoRef}
        src={item.videoURL}
        muted={true}
        loop={true}
        autoPlay={isPlaying}
        controls={false}
        className="video"
      />
      <div className="video-content">
        <p>@{item.author}</p>
        <p>
          Video by <a href="/">{item.author} </a> on Pexel
        </p>
      </div>
    </div>
  );
};

export default InfiniteScrollItem;
