import { VideoMessageServiceClient } from '../../generated/Video_messageServiceClientPb';
import { VideoMessageChunk, VideoMessageMetadata } from '../../generated/video_message_pb';
import { grpc } from "@improbable-eng/grpc-web";
import { v4 as uuidv4 } from "uuid";
import { Metadata } from "grpc-web";

import * as video_message_pb from "../../generated/video_message_pb"; // Import the missing package
import * as grpcWeb from "grpc-web";

import { ClientReadableStream } from "grpc-web";
import GrpcWebClientImpl, { GrpcWebClientBase } from "grpc-web";
import {
    UploadVideoMessageRequest,
} from "../../generated/video_message_pb";




class VideoUploadManager implements IVideoUploadManager {
    async uploadVideo(videoBlob: Blob, metadata: VideoMessageMetadata): Promise<void> {

        const messageId = uuidv4();
        const chunkSize = 1024 * 1024; // 1MB
        const videoChunks: VideoMessageChunk[] = [];
        let chunkIndex = 0;

        for (let start = 0; start < videoBlob.size; start += chunkSize) {
            const chunk = videoBlob.slice(start, start + chunkSize);
            const videoChunk = new VideoMessageChunk();
            videoChunk.setMessageId(messageId);
            videoChunk.setChunkIndex(chunkIndex);
            videoChunk.setData(new Uint8Array(await chunk.arrayBuffer()));
            videoChunks.push(videoChunk);
            chunkIndex++;
        }

        const client = new grpcWeb.GrpcWebClientBase({
            format: "text",
            suppressCorsPreflight: true,
        });
        // Import the missing package

        // ...

        metadata.setId(messageId);
        metadata.setSize(chunkSize);

        const methodDescriptor = new grpcWeb.MethodDescriptor(
            "/video_message_service.VideoMessageService/UploadVideoMessage",
            grpcWeb.MethodType.SERVER_STREAMING,
            video_message_pb.VideoMessageChunk,
            video_message_pb.VideoMessageMetadata,
            (request: video_message_pb.VideoMessageChunk) => {
                return request.serializeBinary();
            },
            video_message_pb.VideoMessageMetadata.deserializeBinary
        );

        let stream: grpcWeb.ClientReadableStream<video_message_pb.VideoMessageMetadata> | null =
            null;

        for (const videoChunk of videoChunks) {
            stream = client.rpcCall(
                "http://localhost:8080/video_message_service.VideoMessageService/UploadVideoMessage",
                videoChunk,
                {},
                methodDescriptor,
                (
                    err: grpcWeb.RpcError,
                    response: video_message_pb.VideoMessageMetadata
                ) => {
                    if (err) {
                        console.error("Error uploading video:", err);
                    } else {
                        console.log("Received response:", response.toObject());
                    }
                }
            );
        }

        if (stream) {
            stream.on("end", () => {
                console.log("Video upload complete");
            });
        }
    } catch(error) {
        console.error("Error uploading video:", error);
    }
};


    } {
  orts VideoMessageServiceClient {]