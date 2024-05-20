import * as grpcWeb from "grpc-web";
import { VideoMessageServiceClient } from "@/generated/Video_messageServiceClientPb";
import video_message_pb, {
  VideoMessageChunk,
} from "@/generated/video_message_pb"; // Add this line
import { v4 as uuidv4 } from "uuid"; // Add this line

declare const uploadVideoMessage: any;

export async function uploadVideo(
  videoBlob: Blob,
  metadata: video_message_pb.VideoMessageMetadata,
): Promise<video_message_pb.VideoMessageMetadata> {
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

  metadata.setId(messageId);
  metadata.setSize(chunkSize);

  const call = uploadVideoMessage(
    async (
      err: grpcWeb.RpcError,
      response: video_message_pb.VideoMessageMetadata,
    ) => {
      console.log("Upload response", response);

      if (err) {
        console.error("Upload failed", err);
      } else {
        console.log("Upload successful", response);
      }
    },
  );
  call.write(metadata);
  return call;
}

//     const client = new VideoMessageServiceClient("http://localhost:8080");
//     const methodDescriptor = new grpcWeb.MethodDescriptor(
//         "/video.VideoMessageService/UploadVideoMessage",
//         grpcWeb.MethodType.SERVER_STREAMING,
//         uploadVideoMessage,
//         uploadVideoMessage
//     );
//     const request = new uploadVideoMessage();
//     request.setMetadata(metadata);
//     request.setVideoBlob(videoBlob);
//     return client.unary(methodDescriptor, {
//         request,
//         host: "http://localhost:8080",
//         onEnd: (res) => {
//             if (res.status === grpcWeb.Status.OK) {
//                 console.log("Upload successful");
//             } else {
//                 console.error("Upload failed");
//             }
//         }
//     });
// }
