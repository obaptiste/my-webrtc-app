/**
 * @fileoverview gRPC-Web generated client stub for video_message_service
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.5.0
// 	protoc              v3.20.3
// source: video_message.proto

/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as video_message_pb from './video_message_pb'; // proto import: "video_message.proto"


export class VideoMessageServiceClient {



  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor(hostname: string,
    credentials?: null | { [index: string]: string; },
    options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname.replace(/\/+$/, '');
    this.credentials_ = credentials;
    this.options_ = options;
  }


  // Method descriptor for UploadVideoMessage
  methodDescriptorUploadVideoMessage = new grpcWeb.MethodDescriptor(
    '/video_message_service.VideoMessageService/UploadVideoMessage', // Full method name
    grpcWeb.MethodType.BIDI_STREAMING, // Bidirectional streaming
    video_message_pb.VideoMessageChunk,  // Request message type
    video_message_pb.VideoMessageMetadata, // Response message type
    (request: video_message_pb.VideoMessageChunk) => {
      return request.serializeBinary(); // Serialize request
    },
    video_message_pb.VideoMessageMetadata.deserializeBinary // Deserialize response
  );

  uploadVideoMessage(
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientDuplexStream<video_message_pb.VideoMessageChunk, video_message_pb.VideoMessageMetadata> {
    return this.client_.bidiStreaming( // Note: bidiStreaming for bidirectional
      this.hostname_ +
      '/video_message_service.VideoMessageService/UploadVideoMessage',
      metadata || {},
      this.methodDescriptorUploadVideoMessage
    );
  }

  methodDescriptorGetVideoMessage = new grpcWeb.MethodDescriptor(
    '/video_message_service.VideoMessageService/GetVideoMessage',
    grpcWeb.MethodType.SERVER_STREAMING,
    video_message_pb.GetVideoMessageRequest,
    video_message_pb.VideoMessageChunk,
    (request: video_message_pb.GetVideoMessageRequest) => {
      return request.serializeBinary();
    },
    video_message_pb.VideoMessageChunk.deserializeBinary
  );

  getVideoMessage(
    request: video_message_pb.GetVideoMessageRequest,
    metadata?: grpcWeb.Metadata): grpcWeb.ClientReadableStream<video_message_pb.VideoMessageChunk> {
    return this.client_.serverStreaming(
      this.hostname_ +
      '/video_message_service.VideoMessageService/GetVideoMessage',
      request,
      metadata || {},
      this.methodDescriptorGetVideoMessage);
  }

  methodDescriptorListVideoMessages = new grpcWeb.MethodDescriptor(
    '/video_message_service.VideoMessageService/ListVideoMessages',
    grpcWeb.MethodType.UNARY,
    video_message_pb.ListVideoMessagesRequest,
    video_message_pb.ListVideoMessagesResponse,
    (request: video_message_pb.ListVideoMessagesRequest) => {
      return request.serializeBinary();
    },
    video_message_pb.ListVideoMessagesResponse.deserializeBinary
  );

  listVideoMessages(
    request: video_message_pb.ListVideoMessagesRequest,
    metadata?: grpcWeb.Metadata | null): Promise<video_message_pb.ListVideoMessagesResponse>;

  listVideoMessages(
    request: video_message_pb.ListVideoMessagesRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
      response: video_message_pb.ListVideoMessagesResponse) => void): grpcWeb.ClientReadableStream<video_message_pb.ListVideoMessagesResponse>;

  listVideoMessages(
    request: video_message_pb.ListVideoMessagesRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
      response: video_message_pb.ListVideoMessagesResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
        '/video_message_service.VideoMessageService/ListVideoMessages',
        request,
        metadata || {},
        this.methodDescriptorListVideoMessages,
        callback);
    }
    return this.client_.unaryCall(
      this.hostname_ +
      '/video_message_service.VideoMessageService/ListVideoMessages',
      request,
      metadata || {},
      this.methodDescriptorListVideoMessages);
  }

  methodDescriptorDeleteVideoMessage = new grpcWeb.MethodDescriptor(
    '/video_message_service.VideoMessageService/DeleteVideoMessage',
    grpcWeb.MethodType.UNARY,
    video_message_pb.DeleteVideoMessageRequest,
    video_message_pb.DeleteVideoMessageResponse,
    (request: video_message_pb.DeleteVideoMessageRequest) => {
      return request.serializeBinary();
    },
    video_message_pb.DeleteVideoMessageResponse.deserializeBinary
  );

  deleteVideoMessage(
    request: video_message_pb.DeleteVideoMessageRequest,
    metadata?: grpcWeb.Metadata | null): Promise<video_message_pb.DeleteVideoMessageResponse>;

  deleteVideoMessage(
    request: video_message_pb.DeleteVideoMessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
      response: video_message_pb.DeleteVideoMessageResponse) => void): grpcWeb.ClientReadableStream<video_message_pb.DeleteVideoMessageResponse>;

  deleteVideoMessage(
    request: video_message_pb.DeleteVideoMessageRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
      response: video_message_pb.DeleteVideoMessageResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
        '/video_message_service.VideoMessageService/DeleteVideoMessage',
        request,
        metadata || {},
        this.methodDescriptorDeleteVideoMessage,
        callback);
    }
    return this.client_.unaryCall(
      this.hostname_ +
      '/video_message_service.VideoMessageService/DeleteVideoMessage',
      request,
      metadata || {},
      this.methodDescriptorDeleteVideoMessage);
  }

  methodDescriptorSearchVideoMessages = new grpcWeb.MethodDescriptor(
    '/video_message_service.VideoMessageService/SearchVideoMessages',
    grpcWeb.MethodType.UNARY,
    video_message_pb.SearchVideoMessagesRequest,
    video_message_pb.SearchVideoMessagesResponse,
    (request: video_message_pb.SearchVideoMessagesRequest) => {
      return request.serializeBinary();
    },
    video_message_pb.SearchVideoMessagesResponse.deserializeBinary
  );

  searchVideoMessages(
    request: video_message_pb.SearchVideoMessagesRequest,
    metadata?: grpcWeb.Metadata | null): Promise<video_message_pb.SearchVideoMessagesResponse>;

  searchVideoMessages(
    request: video_message_pb.SearchVideoMessagesRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
      response: video_message_pb.SearchVideoMessagesResponse) => void): grpcWeb.ClientReadableStream<video_message_pb.SearchVideoMessagesResponse>;

  searchVideoMessages(
    request: video_message_pb.SearchVideoMessagesRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
      response: video_message_pb.SearchVideoMessagesResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
        '/video_message_service.VideoMessageService/SearchVideoMessages',
        request,
        metadata || {},
        this.methodDescriptorSearchVideoMessages,
        callback);
    }
    return this.client_.unaryCall(
      this.hostname_ +
      '/video_message_service.VideoMessageService/SearchVideoMessages',
      request,
      metadata || {},
      this.methodDescriptorSearchVideoMessages);
  }

  methodDescriptorGetVideoMessageMetadata = new grpcWeb.MethodDescriptor(
    '/video_message_service.VideoMessageService/GetVideoMessageMetadata',
    grpcWeb.MethodType.UNARY,
    video_message_pb.GetVideoMessageMetadataRequest,
    video_message_pb.VideoMessageMetadata,
    (request: video_message_pb.GetVideoMessageMetadataRequest) => {
      return request.serializeBinary();
    },
    video_message_pb.VideoMessageMetadata.deserializeBinary
  );

  getVideoMessageMetadata(
    request: video_message_pb.GetVideoMessageMetadataRequest,
    metadata?: grpcWeb.Metadata | null): Promise<video_message_pb.VideoMessageMetadata>;

  getVideoMessageMetadata(
    request: video_message_pb.GetVideoMessageMetadataRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
      response: video_message_pb.VideoMessageMetadata) => void): grpcWeb.ClientReadableStream<video_message_pb.VideoMessageMetadata>;

  getVideoMessageMetadata(
    request: video_message_pb.GetVideoMessageMetadataRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
      response: video_message_pb.VideoMessageMetadata) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
        '/video_message_service.VideoMessageService/GetVideoMessageMetadata',
        request,
        metadata || {},
        this.methodDescriptorGetVideoMessageMetadata,
        callback);
    }
    return this.client_.unaryCall(
      this.hostname_ +
      '/video_message_service.VideoMessageService/GetVideoMessageMetadata',
      request,
      metadata || {},
      this.methodDescriptorGetVideoMessageMetadata);
  }

}

