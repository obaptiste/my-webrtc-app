import React, { useState, useRef, useCallback } from "react";
import prisma from "../../lib/prisma";
import { VideoMessage } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import {
  VideoMessageChunk,
  VideoMessageMetadata,
} from "../../generated/proto/video_messaging_pb.d";
import { ClientDuplexStream, ServerWritableStream } from "@grpc/grpc-js";
import { createDuplexStream } from "grpc-web-helpers";
import { ServerDuplexStream } from "@grpc/grpc-js";
import uploadVideoMessage from "@/src/services/videoMessageService/uploadVideoMessage";

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

    //Collect metadata
    // const metadata: VideoMessageMetadata = new VideoMessageMetadata();

    const duplexStreamInstance: ServerDuplexStream<
      VideoMessageChunk,
      VideoMessageChunk
    > = createDuplexStream();

    uploadVideoMessage(duplexStreamInstance);
        VideoMessageChunk,
        VideoMessageMetadata
      >
    );
    try {
      for (let i = 0; i < recordedChunks.length; i++) {
        const chunk = recordedChunks[i];
        const messageChunk = new VideoMessageChunk();
        messageChunk.setMessageId("some-message-id"); // Assign a new message ID
        messageChunk.setChunkIndex(i);
        messageChunk.setData(new Uint8Array(await chunk.arrayBuffer()));
        duplexStreamInstance.write(messageChunk);
      }
      duplexStreamInstance.end();
      recordedChunks = []; // Clear the recorded chunks
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
