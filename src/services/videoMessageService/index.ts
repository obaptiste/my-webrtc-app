import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { VideoMessageChunk, VideoMessageMetadata } from '@/generated/proto/video_messaging_pb';
import { GetVideoMessageRequest, ListVideoMessagesRequest, ListVideoMessagesResponse, SearchVideoMessagesRequest, SearchVideoMessagesResponse, DeleteVideoMessageRequest, DeleteVideoMessageResponse } from '@/generated/proto/video_messaging_pb';
import { ServerDuplexStream, ServerUnaryCall, sendUnaryData, ServerWritableStream } from '@grpc/grpc-js';



export interface VideoMessageServiceHandlers {
    UploadVideoMessage(call: ServerDuplexStream<VideoMessageChunk, VideoMessageMetadata>): void;
    GetVideoMessage(call: ServerWritableStream<GetVideoMessageRequest, VideoMessageChunk>): void;
    // SendVideoMessage(call: ServerUnaryCall<VideoMessageChunk, VideoMessageMetadata>, callback: grpc.sendUnaryData<VideoMessageChunk>): void;
    ListVideoMessages(call: ServerUnaryCall<ListVideoMessagesRequest, ListVideoMessagesResponse>, callback: sendUnaryData<ListVideoMessagesResponse>): void;
    DeleteVideoMessage(call: ServerUnaryCall<DeleteVideoMessageRequest, DeleteVideoMessageResponse>, callback: sendUnaryData<DeleteVideoMessageResponse>): void;
    SearchVideoMessages(call: ServerUnaryCall<SearchVideoMessagesRequest, SearchVideoMessagesResponse>, callback: sendUnaryData<SearchVideoMessagesResponse>): void;
}

export interface VideoMessageServiceDefinition extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    VideoMessagingService: grpc.MethodDefinition<any, any>;
}

// index.ts

export { default as GetVideoMessage } from './getVideoMessage';
//export { default as GetVideoMessageMeta } from './updateVideoMessage';
export { default as ListVideoMessages } from './listVideoMessages';
export { default as SearchVideoMessages } from './searchVideoMessages';
export { default as UploadVideoMessage } from './uploadVideoMessage';
export { default as DeleteVideoMessage } from './deleteVideoMessage';
