
import { VideoMessageServiceClient } from '../../generated/Video_messageServiceClientPb';
import { VideoMessageChunk, VideoMessageMetadata } from '../../generated/video_message_pb';
import { v4 as uuidv4 } from "uuid";
import * as VideoMessageServicePb from "../../generated/video_message_pb"; // Import the missing package
import * as grpcWeb from "grpc-web";
import { Subject, Observable } from "rxjs";

import { IVideoUploadManager } from "../interfaces/video";
import { Metadata } from "grpc-web";
import { on } from 'events';
import { StatusCode } from "grpc-web";

export class VideoUploadManager implements IVideoUploadManager<number> {
    async uploadVideo(videoBlob: Blob, metadata: VideoMessageMetadata): Promise<Observable<number>> {

        const progressSubject = new Subject<number>();
        const messageId = uuidv4();
        const chunkSize = 1024 * 1024; // 1MB
        const totalChunks = Math.ceil(videoBlob.size / chunkSize);
        const videoChunks: VideoMessageChunk[] = [];
        let chunkIndex = 0;

        //const vidmetadata = new VideoMessageMetadata();
        // vidmetadata.setId(messageId);
        // vidmetadata.setSize(chunkSize);
        // const metadata_vid = vidmetadata as unknown as Metadata;
        const methodDescriptor = new grpcWeb.MethodDescriptor(
            "/video_message_service.VideoMessageService/UploadVideoMessage",
            grpcWeb.MethodType.SERVER_STREAMING,
            VideoMessageServicePb.VideoMessageChunk,
            VideoMessageServicePb.VideoMessageMetadata,
            (request: VideoMessageServicePb.VideoMessageChunk) => {
                return request.serializeBinary();
            },
            VideoMessageServicePb.VideoMessageMetadata.deserializeBinary
        );

        const call = VideoMessageServiceClient.uploadVideoMessage((error: grpcWeb.RpcError, response: VideoMessageServicePb.VideoMessageMetadata) => {
            onEnd: (response: VideoMessageServicePb.VideoMessageMetadata) => {
                if (response && grpcWeb.StatusCode.OK) {
                    progressSubject.next(100);
                    progressSubject.complete();
                } else {
                    progressSubject.error(error);
                }
            }
        });

        const uploadChunk = async (index: number) => {
            const start = index * chunkSize;
            const chunk = videoBlob.slice(start, Math.min(start + chunkSize, videoBlob.size));
            const videoChunk = new VideoMessageChunk();
            videoChunk.setMessageId(messageId);
            videoChunk.setChunkIndex(index);
            videoChunk.setData(new Uint8Array(await chunk.arrayBuffer()));
            call.write(videoChunk);

            const progress = (index + 1) / totalChunks * 100;
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