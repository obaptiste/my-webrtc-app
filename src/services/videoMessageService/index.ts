import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { VideoMessageChunk, VideoMessageMetadata } from '@/generated/proto/video_messaging_pb';
import { GetVideoMessageRequest, ListVideoMessagesRequest, ListVideoMessagesResponse, SearchVideoMessagesRequest, SearchVideoMessagesResponse, DeleteVideoMessageRequest, DeleteVideoMessageResponse } from '@/generated/proto/video_messaging_pb';
import { ServerDuplexStream, ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';



export interface VideoMessageServiceHandlers {
    GetVideoMessageMetaData(call: ServerUnaryCall<GetVideoMessageRequest, VideoMessageMetadata>): void;
    UploadVideoMessage(call: ServerDuplexStream<VideoMessageChunk, VideoMessageMetadata>): void;
    GetVideoMessage(call: ServerUnaryCall<GetVideoMessageRequest, VideoMessageMetadata>, callback: grpc.sendUnaryData<VideoMessageChunk>): void;
    ListVideoMessages(call: ServerUnaryCall<ListVideoMessagesRequest, ListVideoMessagesResponse>): void;
    DeleteVideoMessage(call: ServerUnaryCall<DeleteVideoMessageRequest, DeleteVideoMessageResponse>): void;
    SearchVideoMessages(call: ServerUnaryCall<SearchVideoMessagesRequest, SearchVideoMessagesResponse>): void;
}

export interface VideoMessageServiceDefinition {
    VideoMessagingService: {
        service: {
            GetVideoMessageMetaData: grpc.handleUnaryCall<GetVideoMessageRequest, VideoMessageMetadata>,
            UploadVideoMessage: grpc.handleServerStreamingCall<VideoMessageChunk, VideoMessageMetadata>,
            GetVideoMessage: grpc.handleClientStreamingCall<GetVideoMessageRequest, VideoMessageChunk>,

        }
    }
}

// index.ts

export { default as GetVideoMessage } from './getVideoMessage';
//export { default as GetVideoMessageMeta } from './updateVideoMessage';
export { default as ListVideoMessages } from './listVideoMessages';
export { default as SearchVideoMessages } from './searchVideoMessages';
export { default as UploadVideoMessage } from './uploadVideoMessage';
export { default as DeleteVideoMessage } from './deleteVideoMessage';
