import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { VideoMessageChunk, VideoMessageMetadata } from '@/generated/proto/video_messaging_pb';
import { GetVideoMessageRequest, ListVideoMessagesRequest, ListVideoMessagesResponse, SearchVideoMessagesRequest, SearchVideoMessagesResponse, DeleteVideoMessageRequest, DeleteVideoMessageResponse } from '@/generated/proto/video_messaging_pb';
import { ServerDuplexStream, ServerUnaryCall, sendUnaryData, ServerWritableStream } from '@grpc/grpc-js';



export interface VideoMessageServiceHandlers {
    GetVideoMessageMetaData(call: ServerWritableStream<GetVideoMessageRequest, VideoMessageMetadata>): void;
    UploadVideoMessage(call: ServerDuplexStream<VideoMessageChunk, VideoMessageMetadata>): void;
    GetVideoMessage(call: ServerWritableStream<GetVideoMessageRequest, VideoMessageMetadata>, callback: grpc.sendUnaryData<VideoMessageChunk>): void;
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