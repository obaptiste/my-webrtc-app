"use client";
import {
  Button,
  Grid,
  Typography,
  Container,
  Box,
  CircularProgress,
} from "@mui/material";
import VideoRecorder, {
  useVideoRecorder,
} from "../app/components/VideoRecorder";
import VideoPreview from "../app/components/VideoPreview";
import { VideoProvider } from "../app/contexts/VideoContext";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const InnerHomePage = () => {
  const {
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
    canRetry,
    retryRecording,
  } = useVideoRecorder();

  // const handleStartRecording = () => {
  //   startRecording();
  // };

  // const handleStopRecording = () => {
  //   stopRecording();
  // };

  // const handleUpload = async () => {
  //   if (recordedVideo) {

  // }

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
              {canRetry ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={retryRecording}
                >
                  Retry Recording
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onStartRecording}
                  disabled={uploadState !== "idle"}
                  sx={{ mt: 2 }}
                >
                  {uploadState === "idle"
                    ? "Upload"
                    : uploadState === "uploading"
                      ? "Uploading..."
                      : uploadState === "success"
                        ? "Uploaded"
                        : uploadState === "error"
                          ? "Error" // Add more states as needed
                          : "Unknown"}
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={onStopRecording}
                sx={{ mt: 2 }}
              >
                Stop Recording
              </Button>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">
                  Upload Progress: {uploadMessage}
                  {uploadProgress > 0 && (
                    <CircularProgress
                      variant="determinate"
                      value={uploadProgress}
                      sx={{ mt: 2 }}
                    />
                  )}
                </Typography>
              </Box>
            </>
          ) : (
            <VideoRecorder
              onStartRecording={onStartRecording}
              onStopRecording={onStopRecording}
              onRecordingComplete={onRecordingComplete}
              onUploadProgress={onUploadProgress}
              onUploadStarted={onUploadStarted}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

const HomePage: React.FC = () => {
  return (
    <VideoProvider>
      <InnerHomePage />
    </VideoProvider>
  );
};

export default HomePage;
