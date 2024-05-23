"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { VideoContext, useVideoContext } from "../contexts/VideoContext";
import { IVideoRecorderProps } from "../interfaces/video";
import { PrismaClient } from "@prisma/client";
import { Socket, io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { Button, Grid, Typography } from "@mui/material";
import styles from "./VideoRecorder.module.css";
import { lazy } from "react";
import { on } from "events";

const VideoMessageMetadata = lazy(() =>
  import("@/generated/video_message_pb").then((mod) => ({
    default: new mod.VideoMessageMetadata() as any,
  })),
);

const prisma = new PrismaClient();

export function useVideoRecorder(): IVideoRecorderProps {
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
  const [socket, setSocket] = useState<Socket | null>(null);
  const [videoMessageId, setVideoMessageId] = useState<string | null>(null);
  const MAX_RECORDING_TIME = 180; // 3 minutes in seconds

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  let timeInterval: NodeJS.Timer | null = null;

  //const socket = io("/api/websockets", {});

  useEffect(() => {
    const socket = io("/api/websockets", {});
    setSocket(socket);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("open", () => {
        console.log("WebSocket connection opened");
      });

      socket.on("message", (event: { data: string }) => {
        const data = JSON.parse(event.data);
        if (data.type === "metadataSaved" && data.videoMessageId) {
          setVideoMessageId(data.videoMessageId);
          console.log("Video message ID saved:", data.videoMessageId);
        } else if (data.type === "chunkSaved") {
          const progress = Math.round(
            (data.chunkIndex / recordedChunksRef.current.length) * 100,
          );
          setUploadProgress(progress);
          onUploadProgress(progress);
        }
      });

      socket.on("error", (error) => {
        console.error("WebSocket error:", error);
        setUploadState("error");
      });

      socket.on("close", () => {
        console.log("WebSocket connection closed");
      });

      return () => {
        socket.close();
      };
    }
  }, [socket]);

  //     // Now start sending video chunks
  //     const videoChunks = recordedChunksRef.current;
  //     const chunkSize = 1024 * 1024; // 1MB chunks
  //     const totalChunks = Math.ceil(recordedVideo!.size / chunkSize);
  //     for (let i = 0; i < totalChunks; i++) {
  //       const start = i * chunkSize;
  //       const end = Math.min(start + chunkSize, recordedVideo!.size);
  //       const chunk = recordedVideo!.slice(start, end);
  //       const chunkData = {
  //         type: "videoChunk",
  //         videoMessageId,
  //         chunkIndex: i,
  //         data: chunk,
  //       };
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         const base64Data = (reader.result as string).split(",")[1]; // Get the Base64 part
  //         socket.emit("videoChunk", { ...chunkData, data: base64Data });
  //       };
  //       reader.readAsDataURL(chunk);
  //     }
  //   });

  //   socket.on("error", (error) => {
  //     console.error("WebSocket error:", error);
  //     setUploadState("error");
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [socket, recordedVideo]);

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
    if (!socket || !recordedVideo) return;
    if (uploadState === "uploading") return;

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
          socket.send(
            JSON.stringify({
              type: "videoChunk",
              videoMessageId,
              chunkIndex: chunkIndex,
              data: base64Data,
            }),
          );
          chunkIndex++;

          if (chunkIndex < recordedChunksRef.current.length) {
            const nextChunk = recordedChunksRef.current[chunkIndex];
            reader.readAsDataURL(nextChunk);
          } else {
            //  All chunks have been sent
            socket.send(JSON.stringify({ type: "uploadComplete" }));
            setUploadState("success");
            //onUploadComplete();
          }
        };

        const firstChunk = recordedChunksRef.current[0];
        reader.readAsDataURL(firstChunk);
      }
    };

    socket.on("message", (event: { data: string }) => {
      const data = JSON.parse(event.data);
      if (data.type === "metadataSaved" && data.videoMessageId) {
        sendChunks();
      } else if (data.type === "chunkSaved") {
        const progress = Math.round(
          (data.chunkIndex / recordedChunksRef.current.length) * 100,
        );

        setUploadProgress(progress);
        onUploadProgress(progress);
      }
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

//:TODO: Add the following to the VideoRecorder component
//VideoMessageMetadata class and constuctor

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
