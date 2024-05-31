"use client";
import React, { useState, useRef, useEffect, useCallback, lazy } from "react";
import { VideoContext, useVideoContext } from "../contexts/VideoContext";
import { IVideoRecorderProps } from "../interfaces/video";
import { PrismaClient } from "@prisma/client";
import { Socket, io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { Button, Grid, Typography } from "@mui/material";
import styles from "./VideoRecorder.module.css";

const VideoMessageMetadata = lazy(() =>
  import("@/generated/video_message_pb").then((mod) => ({
    default: new mod.VideoMessageMetadata() as any,
  })),
);

const prisma = new PrismaClient();

export function useVideoRecorder(): IVideoRecorderProps {
  const {
    recordedVideo,
    setRecordedVideo,
    uploadMessage,
    setUploadMessage,
    uploadProgress,
    setUploadProgress,
  } = useVideoContext();

  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [canRetry, setCanRetry] = useState(false);
  const [uploadState, setUploadState] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [videoMessageId, setVideoMessageId] = useState<string | null>(null);

  const MAX_RECORDING_TIME = 35; // 35 seconds
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timeInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const newSocket = io("/api/websockets", {
      transports: ["websocket"],
      upgrade: false,
      autoConnect: false,
      reconnection: false,
      rejectUnauthorized: false,
    });

    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("open", () => console.log("WebSocket connection opened"));
    newSocket.on("error", (error) => {
      console.error("WebSocket error:", error);
      setUploadState("error");
    });
    newSocket.on("close", () => console.log("WebSocket connection closed"));

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    const handleSocketMessage = (event: { data: string }) => {
      const data = JSON.parse(event.data);
      console.log("Received message from server:", data);

      if (data.type === "metadataSaved") {
        setVideoMessageId(data.videoMessageId);
      } else if (data.type === "chunkSaved") {
        const chunkIndex = data.chunkIndex;
        const chunk = data.data;
        const videoBlob = new Blob([chunk], { type: "video/mp4" });
        console.log("Received video chunk:", data);
      }
    };

    if (socket) {
      socket.on("message", handleSocketMessage);

      return () => {
        socket.off("message", handleSocketMessage);
      };
    }
  }, [socket]);

  const handleStartRecording = () => {
    console.log("Starting recording");
    setUploadMessage("Recording started");

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
          type: "video/mp4",
        });
        setRecordedVideo(videoBlob);
        setUploadMessage("Recording stopped");
        handleRecordingComplete(videoBlob);
        recordedChunksRef.current = [];
      };

      timeInterval.current = setInterval(() => {
        setDuration((prevDuration) => {
          if (prevDuration >= MAX_RECORDING_TIME - 30) setShowOverlay(true);
          if (prevDuration >= MAX_RECORDING_TIME - 10)
            setCountdown(MAX_RECORDING_TIME - prevDuration);
          if (prevDuration >= MAX_RECORDING_TIME) handleStopRecording();

          return prevDuration + 1;
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

      if (timeInterval.current) clearInterval(timeInterval.current);
    }
  }, []);

  useEffect(() => {
    if (!isRecording && recordedVideo && duration <= 30) setCanRetry(true);
    else setCanRetry(false);
  }, [isRecording, recordedVideo, duration]);

  const handleRecordingComplete = async (videoBlob: Blob) => {
    console.log("handle recording complete in operation");
    if (!socket || !recordedVideo || uploadState === "uploading") return;

    setUploadState("uploading");
    onUploadStarted();

    const metadata = {
      id: `video_id_${uuidv4()}`,
      title: "Video Title",
      description: "Video Description",
      createdAt: new Date().toISOString(),
      createdBy: "current_user_id",
      senderId: 1,
      recipientId: 2,
      duration: duration,
      size: videoBlob.size,
    };

    // Send metadata as json over websocket
    socket.send(
      JSON.stringify({
        type: "metadata",
        metadata: metadata,
      }),
    );

    // Send video chunks
    const sendChunks = async () => {
      if (videoMessageId) {
        const reader = new FileReader();
        let chunkIndex = 0;

        reader.onload = (event) => {
          const base64Data = (event.target.result as string).split(",")[1];
          const isLastChunk =
            chunkIndex === recordedChunksRef.current.length - 1;

          socket.send(
            JSON.stringify({
              type: "videoChunk",
              videoMessageId,
              chunkIndex,
              data: base64Data,
              isLastChunk,
            }),
          );

          chunkIndex++;

          if (chunkIndex < recordedChunksRef.current.length) {
            const nextChunk = recordedChunksRef.current[chunkIndex];
            reader.readAsDataURL(nextChunk);
          }
        };

        const firstChunk = recordedChunksRef.current[0];
        reader.readAsDataURL(firstChunk);
      }
    };

    socket.on("chunkSaved", (data) => {
      const progress = Math.round(
        (data.chunkIndex / recordedChunksRef.current.length) * 100,
      );
      setUploadProgress(progress);
      onUploadProgress(progress);
    });

    // Start sending chunks after metadata is saved
    socket.on("metadataSaved", () => {
      sendChunks();
    });
  };

  const retryRecording = () => {
    setRecordedVideo(null);
    setUploadProgress(0);
    setUploadState("idle");
    setUploadMessage("waiting for upload");
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
    setUploadMessage("uploading");
  };

  const onUploadComplete = () => {
    setUploadState("success");
    // Update the UI to indicate upload has completed
    setUploadMessage("upload complete");
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

//:TODO: Add the following to the VideoRecorder component
//VideoMessageMetadata class and constuctor

export const VideoRecorder = (props: IVideoRecorderProps) => {
  const [isClient, setIsClient] = useState(false);
  const [uploadState, setUploadState] = useState(
    "idle" as "idle" | "uploading" | "success" | "error",
  );
  const [canRetry, setCanRetry] = useState(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const {
    recordedVideo,
    setRecordedVideo,
    uploadMessage,
    setUploadMessage,
    uploadProgress,
    setUploadProgress,
  } = useVideoContext();

  const MAX_RECORDING_TIME = 60; // 3 minutes in seconds

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

  return (
    <VideoContext.Provider
      value={{
        setRecordedVideo,
        recordedVideo,
        setUploadProgress,
        uploadProgress,
        uploadState,
        setUploadMessage,
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
          <video
            className={styles.camera_display}
            ref={videoRef}
            width="400"
            autoPlay
            playsInline
            muted
          />
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
