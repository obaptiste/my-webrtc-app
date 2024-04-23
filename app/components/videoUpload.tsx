import React, { useState, useRef, useCallback } from "react";
import { uploadVideoMessage } from "@prisma/client"; // Import the missing function
import client from "@prisma/client"; // Replace "../../path/to/client" with the actual path to the client module
import {
  VideoMessageChunk,
  VideoMessageMetadata,
  GetVideoMessageRequest,
  ListVideoMessagesRequest,
  SearchVideoMessagesRequest,
} from "../../generated/proto/video_messaging_pb";

const MAX_CHUNK_SIZE = 1024 * 1024; // 1MB

const VideoUpload = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const videoRef = useRef<HTMLVideoElement>(null);
  let mediaRecorder: MediaRecorder | null = null;
  let recordedChunks: Blob[] = [];

  const startRecording = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = handleDataAvailable;
          mediaRecorder.start();
          setIsRecording(true);
        }
      })
      .catch((error) => {
        // Handle error
        console.error("Error accessing media devices:", error);
      });
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  }, []);

  const handleDataAvailable = useCallback(
    (event: BlobEvent) => {
      recordedChunks.push(event.data);
      if (event.data.size > 0) {
        uploadChunks();
      }
    },
    [recordedChunks] // Remove 'uploadChunks' as a dependency
  );

  const uploadChunks = useCallback(async () => {
    setUploadStatus("uploading");

    // ...

    const stream = uploadVideoMessage(/* ... */); // Call the function with the appropriate arguments

    try {
      for (let i = 0; i < recordedChunks.length; i++) {
        const chunk = recordedChunks[i];
        const messageChunk = new VideoMessageChunk();
        messageChunk.setMessageId("some-message-id"); // Assign a new message ID
        messageChunk.setChunkIndex(i);
        messageChunk.setData(new Uint8Array(await chunk.arrayBuffer()));
        stream.write(messageChunk);
      }
      stream.end();
      setUploadStatus("success");
    } catch (error) {
      setUploadStatus("error");
      console.error("Error uploading video chunks:", error);
    }
  }, [recordedChunks]);

  return (
    <div>
      <video ref={videoRef} controls />
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      <p>Upload Status: {uploadStatus}</p>
    </div>
  );
};

export default VideoUpload;
