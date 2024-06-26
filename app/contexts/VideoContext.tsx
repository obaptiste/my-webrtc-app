// src/contexts/VideoContext.tsx

import React, { createContext, useContext, useState } from "react";

export const VideoContext = createContext<VideoContextData | undefined>(
  undefined,
);

interface VideoContextData {
  recordedVideo: Blob | null;
  setRecordedVideo: (video: Blob | null) => void;
  uploadProgress?: number;
  setUploadProgress: (progress: number | undefined) => void;
  uploadState?: "idle" | "uploading" | "success" | "error";
  setUploadMessage: (uploadMessage: string | null) => void;
  uploadMessage?: string;
}

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error(
      "useVideoContext must be used within a VideoContextProvider",
    );
  }
  return context;
};

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | undefined>(
    undefined,
  );
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  return (
    <VideoContext.Provider
      value={{
        recordedVideo,
        setRecordedVideo,
        uploadProgress,
        setUploadProgress,
        uploadMessage,
        setUploadMessage,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
