import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { VideoMessageChunk, VideoMessageMetadata } from '@/generated/proto/video_messaging_pb';
import { GetVideoMessageRequest, ListVideoMessagesRequest, ListVideoMessagesResponse, SearchVideoMessagesRequest, SearchVideoMessagesResponse, DeleteVideoMessageRequest, DeleteVideoMessageResponse } from '@/generated/proto/video_messaging_pb';
import { ServerDuplexStream, ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';



export interface VideoMessageServiceHandlers {
    getVideoMessageMetaData(call: ServerUnaryCall<GetVideoMessageRequest, VideoMessageMetadata>): void;
    uploadVideoMessage(call: ServerDuplexStream<VideoMessageChunk, VideoMessageMetadata>): void;
    getVideoMessage(call: ServerUnaryCall<GetVideoMessageRequest, VideoMessageMetadata>, callback: grpc.sendUnaryData<VideoMessageChunk>): void;
    listVideoMessages(call: ServerUnaryCall<ListVideoMessagesRequest, ListVideoMessagesResponse>): void;
    deleteVideoMessage(call: ServerUnaryCall<DeleteVideoMessageRequest, DeleteVideoMessageResponse>): void;
    searchVideoMessages(call: ServerUnaryCall<SearchVideoMessagesRequest, SearchVideoMessagesResponse>): void;
}

export interface VideoMessageServiceDefinition {
    VideoMessagingService: {
        service: {
            getVideoMessageMetaData: grpc.handleUnaryCall<GetVideoMessageRequest, VideoMessageMetadata>,
            uploadVideoMessage: grpc.handleServerStreamingCall<VideoMessageChunk, VideoMessageMetadata>,
            getVideoMessage: grpc.handleClientStreamingCall<GetVideoMessageRequest, VideoMessageChunk>,
        }
    }
}