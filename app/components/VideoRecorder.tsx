"use client";
import React, { useState, useRef, useEffect } from "react";
import { VideoContext } from "../contexts/VideoContext";
import { IVideoRecorderProps, IVideoUploadManager } from "../interfaces/video";

import * as grpcWeb from "grpc-web";
import { Metadata } from "grpc-web";
import { useVideoContext } from "../contexts/VideoContext";
import { v4 as uuidv4 } from "uuid";
import { Button, Grid, Typography } from "@mui/material";
import useVideoUploadManager from "@/app/hooks/useVideoUpload";
import { Observable } from "rxjs";

import styles from "./VideoRecorder.module.css";
import { VideoMessageMetadata } from "@/generated/video_message_pb";

interface IVideoUpload<T> {
  uploadVideo: (videoBlob: Blob, metadata: Metadata) => Promise<Observable<T>>;
}

function VideoRecorder({
  onStopRecording,
}: IVideoRecorderProps & IVideoUploadManager<number>) {
  const [uploadProgress, setUploadProgress] = useState<number | undefined>(
    undefined
  );
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const [duration, setDuration] = useState<number>(0);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  //let timeIntervalId: number | null = null;

  const { setRecordedVideo } = useVideoContext();

  const MAX_RECORDING_TIME = 180; // 3 minutes in seconds

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const { uploadStatus, startUpload } = useVideoUploadManager();

  // const metadata = new Metadata();
  // metadata.set("video_id", uuidv4());

  useEffect(() => {
    const constraints = { audio: true, video: true };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream: MediaStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch((error: Error) => {
        console.error("Error accessing media devices:", error);
        // Handle the error
      });
  }, []);

  let timeInterval: NodeJS.Timer | null = null;

  const handleStartRecording = () => {
    if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
      const stream = videoRef.current.srcObject;
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
        // Handle the recorded video data
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
          //overlay logic
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

      // Add event listeners for data availability and stopping if needed
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
      // Handle the recorded video data (more on this later)
      const videoBlob = new Blob(recordedChunksRef.current, {
        type: "video/webm",
      });
      handleRecordingComplete(videoBlob);
    }
  };

  // ...

  const handleRecordingComplete = async (videoBlob: Blob) => {
    console.log("Recording complete", videoBlob);
    const metadata = new VideoMessageMetadata();

    metadata.setId(`video_id_${uuidv4()}`);

    await startUpload(videoBlob, metadata);
  };

  return (
    <VideoContext.Provider
      value={{
        setRecordedVideo,
        recordedVideo: null,
        setUploadProgress,
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
      <VideoRecorder onStartRecording={handleStartRecording} onStopRecording={handleStopRecording} 
      onRecordingComplete={handleRecordingComplete}  onUploadStarted={startUpload} />
    </VideoContext.Provider>
  );
}

export default VideoRecorder;
