"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button, Grid } from "@mui/material";

interface VideoRecorderProps {
  // Add props if needed, e.g., for handling recorded video data
}

function VideoRecorder({}: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  let timeIntervalId: number | null = null;

  const MAX_RECORDING_TIME = 180; // 3 minutes in seconds

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

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
      mediaRecorderRef.current = new MediaRecorder(videoRef.current.srcObject);
      mediaRecorderRef.current.ondataavailable = (event) => {
        // Handle the recorded video data
      };

      timeInterval = setInterval(() => {
        setDuration((prevDuration) => {
          //overlay logic
          if (prevDuration >= MAX_RECORDING_TIME - 30) {
            setShowOverlay(true);
          } // Countdown logic
          if (prevDuration >= MAX_RECORDING_TIME - 10) {
            setCountdown(MAX_RECORDING_TIME - prevDuration);
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
      if (timeInterval) {
        clearInterval(timeInterval as unknown as number);
        timeInterval = null;
      }
      // Handle the recorded video data (more on this later)
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
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
  );
}

export default VideoRecorder;
