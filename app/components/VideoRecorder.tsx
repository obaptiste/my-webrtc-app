"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { VideoContext, useVideoContext } from "../contexts/VideoContext";
import { IVideoRecorderProps } from "../interfaces/video";
import { useWebSocket } from "nextjs-websocket";
import { PrismaClient } from "@prisma/client";

import { v4 as uuidv4 } from "uuid";
import { Button, Grid, Typography } from "@mui/material";
import VideoUploadManager from "./VideoUploadManager";
import { VideoMessageMetadata } from "@/generated/video_message_pb";
import styles from "./VideoRecorder.module.css";

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

  const websocket = useWebSocket("/api/websockets", {
    onMessage(message: { data: { toString: () => string } }) {
      const parsedMessage = JSON.parse(message.data.toString());
      if (parsedMessage.type === "metadataSaved") {
        const videoMessageId = parsedMessage.videoMessageId;
        //now start sending video chunks
        const videoChunks = recordedChunksRef.current;
        const chunkSize = 1024 * 1024;
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
        }
      }
    },
  });

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
    if (!websocket) return;
    const uploadManager = new VideoUploadManager();
    const metadata = new VideoMessageMetadata();
    metadata.setId(`video_id_${uuidv4()}`);
    metadata.setDescription("Video Description");
    metadata.setTitle("Video Title");

    // Send metadata as json
    websocket.send({
      type: "metadata",
      metadata: {
        id: metadata.getId(),
        title: metadata.getTitle(),
        description: metadata.getDescription(),
        createdAt: new Date().toISOString(),
        createdBy: "current_user_id",
        senderId: 1,
        recipientId: 2,
      },
    });

    const reader = new FileReader();
    let chunkIndex = 0;

    if (!videoBlob.size) {
      console.error("Error: Recorded video blob is empty.");
      return;
    }

    console.log("Recording complete", videoBlob);
    console.log("Now attempting upload");

    try {
      const observable = await uploadManager.uploadVideo(videoBlob, metadata);
      observable.subscribe({
        next: (progress) => {
          console.log("Upload progress:", progress);
          setUploadProgress(progress);
          setUploadMessage(`Uploading: ${progress.toFixed(2)}%`);
        },
        error: (error) => {
          console.error("Upload failed:", error);
          setUploadState("error");
        },
        complete: async () => {
          console.log("Upload complete");
          setUploadState("success");

          try {
            await prisma.videoMessage.create({
              data: {
                id: metadata.getId(),
                senderId: 1,
                recipientId: 2,
                title: "Video Title",
                description: "Video Description",
                createdAt: new Date().toISOString(),
                createdBy: "current_user_id",
                size: videoBlob.size,
                duration: duration,
                videoUrl: "path to video",
              },
            });
            setUploadMessage("Upload and save to database successful");
          } catch (prismaError) {
            console.error(
              "Error saving video metadata to database:",
              prismaError,
            );
            setUploadState("error");
            setUploadMessage("Error saving video data to database");
          }
        },
      });
    } catch (error) {
      console.error("Error initiating upload:", error);
      setUploadState("error");
    }
  };

  const retryRecording = () => {
    setRecordedVideo(null);
    setUploadProgress(0);
    setUploadState("idle");
    setUploadMessage(null);
    setCanRetry(false);
  };

  //Callback functions for the VideoRecorder component

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
    // Update the ui based on upload progress
  };

  const onUploadStarted = () => {
    setUploadState("uploading");
    //update the ui to indicate upload has started
  };

  const onUploadComplete = () => {
    setUploadState("success");
    //update the ui to indicate upload has completed
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

export function VideoRecorder(props: IVideoRecorderProps) {
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
      clearInterval(timeInterval as unknown as number);
    }
  }, [timeInterval]);

  const handleRecordingComplete = async (videoBlob: Blob) => {
    const uploadManager = new VideoUploadManager();
    const metadata = new VideoMessageMetadata();
    metadata.setId(`video_id_${uuidv4()}`);

    if (!videoBlob.size) {
      console.error("Error: Recorded video blob is empty.");
      return;
    }

    console.log("Recording complete", videoBlob);
    console.log("Now attempting upload");

    try {
      const observable = await uploadManager.uploadVideo(videoBlob, metadata);
      observable.subscribe({
        next: (progress) => {
          console.log("Upload progress:", progress);
          setUploadProgress(progress);
          setUploadMessage(`Uploading: ${progress.toFixed(2)}%`);
        },
        error: (error) => {
          console.error("Upload failed:", error);
          setUploadState("error");
        },
        complete: () => {
          console.log("Upload complete");
          setUploadState("success");
        },
      });
    } catch (error) {
      console.error("Error initiating upload:", error);
      setUploadState("error");
    }
  };

  return (
    <VideoContext.Provider
      value={{
        setRecordedVideo,
        recordedVideo: null,
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
          <video ref={videoRef} width="400" autoPlay muted />
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
}

export default VideoRecorder;
