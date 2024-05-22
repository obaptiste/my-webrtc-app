"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { VideoContext, useVideoContext } from "../contexts/VideoContext";
import { IVideoRecorderProps } from "../interfaces/video";
import { PrismaClient } from "@prisma/client";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { Button, Grid, Typography } from "@mui/material";
import styles from "./VideoRecorder.module.css";
import { lazy } from "react";

const VideoMessageMetadata = lazy(() =>
  import("@/generated/video_message_pb").then((mod) => ({
    default: new mod.VideoMessageMetadata() as any,
  })),
);

const prisma = new PrismaClient();

export function useVideoRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [canRetry, setCanRetry] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadState, setUploadState] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const {
    recordedVideo: recordedVideoRef,
    setRecordedVideo: setRecordedVideoRef,
  } = useVideoContext();

  const MAX_RECORDING_TIME = 180; // 3 minutes in seconds

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  let timeInterval: NodeJS.Timer | null = null;

  const socket = io("/api/websockets", {});

  useEffect(() => {
    socket.on("open", () => {
      console.log("WebSocket connection opened");
    });

    socket.on("metadataSaved", (data) => {
      const videoMessageId = data.videoMessageId;

      // Now start sending video chunks
      const videoChunks = recordedChunksRef.current;
      const chunkSize = 1024 * 1024; // 1MB chunks
      const totalChunks = Math.ceil(recordedVideo!.size / chunkSize);
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, recordedVideo!.size);
        const chunk = recordedVideo!.slice(start, end);
        const chunkData = {
          type: "videoChunk",
          videoMessageId,
          chunkIndex: i,
          data: chunk,
        };
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = (reader.result as string).split(",")[1]; // Get the Base64 part
          socket.emit("videoChunk", { ...chunkData, data: base64Data });
        };
        reader.readAsDataURL(chunk);
      }
    });

    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
      setUploadState("error");
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, recordedVideo]);

  const handleStartRecording = () => {
    if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
      const stream = videoRef.current.srcObject;
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const videoBlob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });
        setRecordedVideo(videoBlob);
        handleRecordingComplete(videoBlob);
        recordedChunksRef.current = [];
      };

      timeInterval = setInterval(() => {
        setDuration((prevDuration) => {
          // Overlay logic
          if (prevDuration >= MAX_RECORDING_TIME - 30) {
            setShowOverlay(true);
          }

          // Countdown logic
          if (prevDuration >= MAX_RECORDING_TIME - 10) {
            setCountdown(MAX_RECORDING_TIME - prevDuration);
          }

          if (prevDuration >= MAX_RECORDING_TIME) {
            handleStopRecording();
          }
          return prevDuration + 1; // Increment every second
        });
      }, 1000);

      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setShowOverlay(false);
      setCountdown(null);

      if (timeInterval) {
        clearInterval(timeInterval as unknown as number);
      }
    }
  }, [timeInterval]);

  useEffect(() => {
    if (!isRecording && recordedVideo && duration <= 30) {
      setCanRetry(true);
    } else {
      setCanRetry(false);
    }
  }, [isRecording, recordedVideo, duration]);

  const handleRecordingComplete = async (videoBlob: Blob) => {
    if (!videoBlob.size) {
      console.error("Error: Recorded video blob is empty.");
      return;
    }

    console.log("Recording complete", videoBlob);
    console.log("Now attempting upload");

    setUploadState("uploading");

    const metadata = {
      id: `video_id_${uuidv4()}`,
      title: "Video Title",
      description: "Video Description",
      createdAt: new Date().toISOString(),
      createdBy: "current_user_id",
      senderId: 1,
      recipientId: 2,
    };

    // Send metadata as json
    socket.emit("metadata", {
      type: "metadata",
      metadata,
    });
  };

  const retryRecording = () => {
    setRecordedVideo(null);
    setUploadProgress(0);
    setUploadState("idle");
    setUploadMessage(null);
    setCanRetry(false);
  };

  // Callback functions for the VideoRecorder component
  const onStartRecording = () => {
    handleStartRecording();
  };

  const onStopRecording = () => {
    handleStopRecording();
  };

  const onRecordingComplete = (videoBlob: Blob) => {
    handleRecordingComplete(videoBlob);
  };

  const onRetryRecording = () => {
    retryRecording();
  };

  const onUploadProgress = (progress: number) => {
    setUploadProgress(progress);
    // Update the UI based on upload progress
  };

  const onUploadStarted = () => {
    setUploadState("uploading");
    // Update the UI to indicate upload has started
  };

  const onUploadComplete = () => {
    setUploadState("success");
    // Update the UI to indicate upload has completed
  };

  return {
    isRecording,
    recordedVideo,
    uploadProgress,
    uploadState,
    uploadMessage,
    onStartRecording,
    onStopRecording,
    onRecordingComplete,
    onUploadProgress,
    onUploadStarted,
    onUploadComplete,
    retryRecording,
    canRetry,
    showOverlay,
    countdown,
  };
}

export const VideoRecorder = (props: IVideoRecorderProps) => {
  const [isClient, setIsClient] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadState, setUploadState] = useState(
    "idle" as "idle" | "uploading" | "success" | "error",
  );
  const [canRetry, setCanRetry] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const { recordedVideo, setRecordedVideo } = useVideoContext();

  const MAX_RECORDING_TIME = 180; // 3 minutes in seconds

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  let timeInterval: NodeJS.Timer | null = null;

  useEffect(() => {
    setIsClient(true);
    // Request media devices
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error accessing media devices.", err);
      });
  }, []);

  if (!isClient) {
    return null;
  }

  const handleStartRecording = () => {
    console.log("Starting recording");
    if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
      const stream = videoRef.current.srcObject;
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const videoBlob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });
        setRecordedVideo(videoBlob);
        handleRecordingComplete(videoBlob);
        recordedChunksRef.current = [];
      };

      timeInterval = setInterval(() => {
        setDuration((prevDuration) => {
          // Overlay logic
          if (prevDuration >= MAX_RECORDING_TIME - 30) {
            setShowOverlay(true);
          }

          // Countdown logic
          if (prevDuration >= MAX_RECORDING_TIME - 10) {
            setCountdown(MAX_RECORDING_TIME - prevDuration);
          }

          if (prevDuration >= MAX_RECORDING_TIME) {
            handleStopRecording();
          }
          return prevDuration + 1; // Increment every second
        });
      }, 1000);

      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setShowOverlay(false);
      setCountdown(null);
      clearInterval(timeInterval as unknown as number);
    }
  };

  const handleRecordingComplete = async (videoBlob: Blob) => {
    const metadata = {
      id: `video_id_${uuidv4()}`,
      title: "Video Title",
      description: "Video Description",
      createdAt: new Date().toISOString(),
      createdBy: "current_user_id",
      senderId: 1,
      recipientId: 2,
    };

    if (!videoBlob.size) {
      console.error("Error: Recorded video blob is empty.");
      return;
    }

    console.log("Recording complete", videoBlob);
    console.log("Now attempting upload");

    setUploadState("uploading");
  };

  return (
    <VideoContext.Provider
      value={{
        setRecordedVideo,
        recordedVideo: recordedVideo,
        setUploadProgress,
        uploadProgress: 0,
        uploadState,
        uploadMessage,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {showOverlay && (
            <div className={styles.recordingOverlay}>
              {countdown ? (
                <Typography variant="h4">
                  Time Remaining: {countdown}
                </Typography>
              ) : (
                <Typography variant="h5">30 Seconds Remaining</Typography>
              )}
            </div>
          )}
          <video ref={videoRef} width="400" autoPlay playsInline muted />
          <div>Status: {uploadMessage}</div>
          <div>Progress: {uploadProgress}%</div>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleStartRecording}
            disabled={isRecording}
          >
            Start Recording
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleStopRecording}
            disabled={!isRecording}
          >
            Stop Recording
          </Button>
        </Grid>
      </Grid>
    </VideoContext.Provider>
  );
};

export default VideoRecorder;
