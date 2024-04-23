//video player component

import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  url: string;
}

const VideoPlayer = ({ url }: VideoPlayerProps) => {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setPlaying(true);
  }, []);

  return (
    <div className="video-player">
      <ReactPlayer
        url={url}
        playing={playing}
        controls={true}
        width="100%"
        height="100%"
      />
    </div>
  );
};
export default VideoPlayer;
