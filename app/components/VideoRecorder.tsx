"use client";
import React, { useState, useRef, useEffect } from "react";
import { VideoContext, useVideoContext } from "../contexts/VideoContext";
import { IVideoRecorderProps } from "../interfaces/video";

import { v4 as uuidv4 } from "uuid";
import { Button, Grid, Typography } from "@mui/material";
import VideoUploadManager from "./VideoUploadManager";
import { VideoMessageMetadata } from "@/generated/video_message_pb";
import styles from "./VideoRecorder.module.css";

function VideoRecorder({ onStopRecording }: IVideoRecorderProps) {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadState, setUploadState] = useState("Waiting to upload...");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const { setRecordedVideo } = useVideoContext();

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
        onStopRecording(videoBlob);
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

      if (timeInterval) {
        clearInterval(timeInterval as unknown as number);
        timeInterval = null;
      }
    }
  };

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
          setUploadState(`Uploading: ${progress.toFixed(2)}%`);
        },
        error: (error) => {
          console.error("Upload failed:", error);
          setUploadState("Upload failed");
        },
        complete: () => {
          console.log("Upload complete");
          setUploadState("Upload complete");
        },
      });
    } catch (error) {
      console.error("Error initiating upload:", error);
      setUploadState("Error initiating upload");
    }
  };

  return (
    <VideoContext.Provider
      value={{
        setRecordedVideo,
        recordedVideo: null,
        setUploadProgress,
        uploadProgress: 0,
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
          <div>Status: {uploadState}</div>
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
