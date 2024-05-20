import { VideoMessageServiceClient } from "../../generated/Video_messageServiceClientPb";
import {
  VideoMessageChunk,
  VideoMessageMetadata,
} from "../../generated/video_message_pb";
import { v4 as uuidv4 } from "uuid";
import * as VideoMessageServicePb from "../../generated/video_message_service_wrapper"; // Import the missing package
import * as grpcWeb from "grpc-web";
import { Subject, Observable } from "rxjs";
import { IVideoUploadManager } from "../interfaces/video";

declare function uploadVideoMessage(
  request: VideoMessageChunk,
  metadata: grpcWeb.Metadata,
  callback: (error: grpcWeb.RpcError, response: VideoMessageMetadata) => void,
): grpcWeb.ClientReadableStream<VideoMessageMetadata>;
export class VideoUploadManager implements IVideoUploadManager<number> {
  async uploadVideo(
    videoBlob: Blob,
    metadata: VideoMessageMetadata,
  ): Promise<Observable<number>> {
    const progressSubject = new Subject<number>();
    const messageId = uuidv4();
    const chunkSize = 1024 * 1024; // 1MB
    const totalChunks = Math.ceil(videoBlob.size / chunkSize);
    const videoChunks: VideoMessageChunk[] = [];
    const chunkIndex = 0;

    const methodDescriptorUploadVideoMessage = new grpcWeb.MethodDescriptor(
      "/video_message_service.VideoMessageService/UploadVideoMessage", // Full method name
      grpcWeb.MethodType.BIDI_STREAMING, // Bidirectional streaming
      video_message_pb.VideoMessageChunk, // Request message type
      video_message_pb.VideoMessageMetadata, // Response message type
      (request: video_message_pb.VideoMessageChunk) => {
        return request.serializeBinary(); // Serialize request
      },
      video_message_pb.VideoMessageMetadata.deserializeBinary, // Deserialize response
    );

    async function uploadVideoMessage(
      metadata?: grpcWeb.Metadata,
    ): grpcWeb.ClientDuplexStream<
      video_message_pb.VideoMessageChunk,
      video_message_pb.VideoMessageMetadata
    > {
      return this.client_.bidiStreaming(
        // Note: bidiStreaming for bidirectional
        this.hostname_ +
          "/video_message_service.VideoMessageService/UploadVideoMessage",
        metadata || {},
        this.methodDescriptorUploadVideoMessage,
      );
    }

    const call = uploadVideoMessage(
      (error: grpcWeb.RpcError, response: VideoMessageMetadata) => {
        (response: VideoMessageMetadata) => {
          if (response && grpcWeb.StatusCode.OK) {
            progressSubject.next(100);
            progressSubject.complete();
          } else {
            progressSubject.error(error);
          }
        };
      },
    );

    const uploadChunk = async (index: number) => {
      const start = index * chunkSize;
      const chunk = videoBlob.slice(
        start,
        Math.min(start + chunkSize, videoBlob.size),
      );
      const videoChunk = new VideoMessageChunk();
      videoChunk.setMessageId(messageId);
      videoChunk.setChunkIndex(index);
      videoChunk.setData(new Uint8Array(await chunk.arrayBuffer()));
      call.write(videoChunk);

      const progress = ((index + 1) / totalChunks) * 100;
      progressSubject.next(progress);

      if (index < totalChunks - 1) {
        setTimeout(() => uploadChunk(index + 1), 10); //Recursively upload next chunk
      } else {
        call.end();
      }
    };

    uploadChunk(0); //start uploading the first chunk

    return progressSubject.asObservable();
  }
}

export default VideoUploadManager;
