import React from "react";
import VideoPlayer from "./videoPlayer";
import { VideoMessage } from "@prisma/client";

type VideoMessageItemProps = {
  message: VideoMessage;
};

const VideoMessageItem = ({ message }: VideoMessageItemProps) => {
  const { id, title, description, videoUrl } = message;

  return (
    <div className="video-message-item">
      <h3>{title}</h3>
      <p>{description}</p>
      <VideoPlayer url={videoUrl} />
    </div>
  );
};

type VideoMessageListProps = {
  messages: VideoMessage[];
};

const VideoMessageList = ({ messages }: VideoMessageListProps) => {
  return (
    <div className="video-message-list">
      {messages.map((message) => (
        <VideoMessageItem key={message.id} message={message} />
      ))}
    </div>
  );
};

export default VideoMessageList;
