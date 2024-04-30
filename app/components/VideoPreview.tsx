// VideoPreview.tsx

"use client";
import React from "react";
import { useVideoContext } from "../contexts/VideoContext";

function VideoPreview() {
  const { recordedVideo } = useVideoContext();

  if (!recordedVideo) {
    return null;
  }
  const videoUrl = URL.createObjectURL(recordedVideo);

  return (
    <div>
      <h2> Recorded Video Preview</h2>
      <video
        controls
        src={recordedVideo ? URL.createObjectURL(recordedVideo) : ""}
      />
    </div>
  );
}

export default VideoPreview;
