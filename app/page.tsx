"use client";
import { useState, useRef } from "react";
import {
  Button,
  Grid,
  Typography,
  Container,
  Box,
  CircularProgress,
} from "@mui/material";
import VideoRecorder from "../app/components/VideoRecorder";
import VideoPreview from "../app/components/VideoPreview";
import { VideoContext, useVideoContext } from "../app/contexts/VideoContext";
import videoMessageServicePb from "@/generated/video_message_pb";
import grpcWeb from "grpc-web";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const InnerHomePage = () => {
  const { recordedVideo, uploadProgress, uploadState } = useVideoContext();

  const handleUpload = async () => {
    // ... (your gRPC-Web upload logic using recordedVideo) ...

    // Update upload progress in context (if applicable)

    try {
      // ... (save metadata to Prisma) ...
    } catch (error) {
      // ... (error handling) ...
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{ mt: 4, p: 4, bgcolor: "white", borderRadius: 2 }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Record a Video Message
      </Typography>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12}>
          {recordedVideo ? (
            <>
              <VideoPreview />
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={uploadState !== "Waiting to upload..."}
              >
                {uploadState === "Waiting to upload..."
                  ? "Upload"
                  : uploadState}
              </Button>
              {uploadProgress > 0 && (
                <CircularProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{ mt: 2 }}
                />
              )}
            </>
          ) : (
            <VideoRecorder />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

const HomePage: React.FC = () => {
  return (
    <VideoContext>
      <InnerHomePage />
    </VideoContext>
  );
};

export default HomePage;
