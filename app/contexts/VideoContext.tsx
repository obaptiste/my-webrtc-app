// src/contexts/VideoContext.tsx

import React, { createContext, useContext, useState } from "react";

export const VideoContext = createContext<VideoContextData | undefined>(
  undefined
);

interface VideoContextData {
  recordedVideo: Blob | null;
  setRecordedVideo: (video: Blob | null) => void;
}

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error(
      "useVideoContext must be used within a VideoContextProvider"
    );
  }
  return context;
};

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);

  return (
    <VideoContext.Provider value={{ recordedVideo, setRecordedVideo }}>
      {children}
    </VideoContext.Provider>
  );
};
