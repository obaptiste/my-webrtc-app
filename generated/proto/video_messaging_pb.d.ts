// package: video_messaging
// file: video_messaging.proto

import * as jspb from "google-protobuf";

export class VideoMessageChunk extends jspb.Message {
  getMessageId(): string;
  setMessageId(value: string): void;

  getChunkIndex(): number;
  setChunkIndex(value: number): void;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VideoMessageChunk.AsObject;
  static toObject(includeInstance: boolean, msg: VideoMessageChunk): VideoMessageChunk.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VideoMessageChunk, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VideoMessageChunk;
  static deserializeBinaryFromReader(message: VideoMessageChunk, reader: jspb.BinaryReader): VideoMessageChunk;
}

export namespace VideoMessageChunk {
  export type AsObject = {
    messageId: string,
    chunkIndex: number,
    data: Uint8Array | string,
  }
}

export class VideoMessageMetadata extends jspb.Message {
  getMessageId(): string;
  setMessageId(value: string): void;

  getSenderId(): string;
  setSenderId(value: string): void;

  getRecipientId(): string;
  setRecipientId(value: string): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  getTargetDurationSeconds(): number;
  setTargetDurationSeconds(value: number): void;

  getActualDurationSeconds(): number;
  setActualDurationSeconds(value: number): void;

  getThumbnail(): Uint8Array | string;
  getThumbnail_asU8(): Uint8Array;
  getThumbnail_asB64(): string;
  setThumbnail(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VideoMessageMetadata.AsObject;
  static toObject(includeInstance: boolean, msg: VideoMessageMetadata): VideoMessageMetadata.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VideoMessageMetadata, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VideoMessageMetadata;
  static deserializeBinaryFromReader(message: VideoMessageMetadata, reader: jspb.BinaryReader): VideoMessageMetadata;
}

export namespace VideoMessageMetadata {
  export type AsObject = {
    messageId: string,
    senderId: string,
    recipientId: string,
    timestamp: number,
    targetDurationSeconds: number,
    actualDurationSeconds: number,
    thumbnail: Uint8Array | string,
  }
}

export class GetVideoMessageRequest extends jspb.Message {
  getMessageId(): string;
  setMessageId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetVideoMessageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetVideoMessageRequest): GetVideoMessageRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetVideoMessageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetVideoMessageRequest;
  static deserializeBinaryFromReader(message: GetVideoMessageRequest, reader: jspb.BinaryReader): GetVideoMessageRequest;
}

export namespace GetVideoMessageRequest {
  export type AsObject = {
    messageId: string,
  }
}

export class ListVideoMessagesRequest extends jspb.Message {
  getRecipientId(): string;
  setRecipientId(value: string): void;

  getPageSize(): number;
  setPageSize(value: number): void;

  getPageToken(): string;
  setPageToken(value: string): void;

  getConversationId(): string;
  setConversationId(value: string): void;

  getStartTime(): number;
  setStartTime(value: number): void;

  getEndTime(): number;
  setEndTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListVideoMessagesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListVideoMessagesRequest): ListVideoMessagesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListVideoMessagesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListVideoMessagesRequest;
  static deserializeBinaryFromReader(message: ListVideoMessagesRequest, reader: jspb.BinaryReader): ListVideoMessagesRequest;
}

export namespace ListVideoMessagesRequest {
  export type AsObject = {
    recipientId: string,
    pageSize: number,
    pageToken: string,
    conversationId: string,
    startTime: number,
    endTime: number,
  }
}

export class ListVideoMessagesResponse extends jspb.Message {
  clearMessagesList(): void;
  getMessagesList(): Array<VideoMessageMetadata>;
  setMessagesList(value: Array<VideoMessageMetadata>): void;
  addMessages(value?: VideoMessageMetadata, index?: number): VideoMessageMetadata;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListVideoMessagesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListVideoMessagesResponse): ListVideoMessagesResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListVideoMessagesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListVideoMessagesResponse;
  static deserializeBinaryFromReader(message: ListVideoMessagesResponse, reader: jspb.BinaryReader): ListVideoMessagesResponse;
}

export namespace ListVideoMessagesResponse {
  export type AsObject = {
    messagesList: Array<VideoMessageMetadata.AsObject>,
  }
}

export class DeleteVideoMessageRequest extends jspb.Message {
  getMessageId(): string;
  setMessageId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteVideoMessageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteVideoMessageRequest): DeleteVideoMessageRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteVideoMessageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteVideoMessageRequest;
  static deserializeBinaryFromReader(message: DeleteVideoMessageRequest, reader: jspb.BinaryReader): DeleteVideoMessageRequest;
}

export namespace DeleteVideoMessageRequest {
  export type AsObject = {
    messageId: string,
  }
}

export class DeleteVideoMessageResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteVideoMessageResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteVideoMessageResponse): DeleteVideoMessageResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteVideoMessageResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteVideoMessageResponse;
  static deserializeBinaryFromReader(message: DeleteVideoMessageResponse, reader: jspb.BinaryReader): DeleteVideoMessageResponse;
}

export namespace DeleteVideoMessageResponse {
  export type AsObject = {
    success: boolean,
  }
}

export class SearchVideoMessagesRequest extends jspb.Message {
  getQuery(): string;
  setQuery(value: string): void;

  getRecipientId(): string;
  setRecipientId(value: string): void;

  getPageSize(): number;
  setPageSize(value: number): void;

  getPageToken(): string;
  setPageToken(value: string): void;

  getStartTime(): number;
  setStartTime(value: number): void;

  getEndTime(): number;
  setEndTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchVideoMessagesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SearchVideoMessagesRequest): SearchVideoMessagesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SearchVideoMessagesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchVideoMessagesRequest;
  static deserializeBinaryFromReader(message: SearchVideoMessagesRequest, reader: jspb.BinaryReader): SearchVideoMessagesRequest;
}

export namespace SearchVideoMessagesRequest {
  export type AsObject = {
    query: string,
    recipientId: string,
    pageSize: number,
    pageToken: string,
    startTime: number,
    endTime: number,
  }
}

export class SearchVideoMessagesResponse extends jspb.Message {
  clearMessagesList(): void;
  getMessagesList(): Array<VideoMessageMetadata>;
  setMessagesList(value: Array<VideoMessageMetadata>): void;
  addMessages(value?: VideoMessageMetadata, index?: number): VideoMessageMetadata;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchVideoMessagesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SearchVideoMessagesResponse): SearchVideoMessagesResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SearchVideoMessagesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchVideoMessagesResponse;
  static deserializeBinaryFromReader(message: SearchVideoMessagesResponse, reader: jspb.BinaryReader): SearchVideoMessagesResponse;
}

export namespace SearchVideoMessagesResponse {
  export type AsObject = {
    messagesList: Array<VideoMessageMetadata.AsObject>,
  }
}

