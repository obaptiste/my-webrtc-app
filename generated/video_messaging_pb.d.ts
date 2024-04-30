import * as jspb from 'google-protobuf'



export class VideoMessageChunk extends jspb.Message {
  getMessageId(): string;
  setMessageId(value: string): VideoMessageChunk;

  getChunkIndex(): number;
  setChunkIndex(value: number): VideoMessageChunk;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): VideoMessageChunk;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VideoMessageChunk.AsObject;
  static toObject(includeInstance: boolean, msg: VideoMessageChunk): VideoMessageChunk.AsObject;
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
  getId(): string;
  setId(value: string): VideoMessageMetadata;

  getTitle(): string;
  setTitle(value: string): VideoMessageMetadata;

  getDescription(): string;
  setDescription(value: string): VideoMessageMetadata;

  getCreatedAt(): string;
  setCreatedAt(value: string): VideoMessageMetadata;

  getCreatedBy(): string;
  setCreatedBy(value: string): VideoMessageMetadata;

  getSize(): number;
  setSize(value: number): VideoMessageMetadata;

  getDuration(): number;
  setDuration(value: number): VideoMessageMetadata;

  getSenderId(): string;
  setSenderId(value: string): VideoMessageMetadata;

  getRecipientId(): string;
  setRecipientId(value: string): VideoMessageMetadata;

  getTimestamp(): number;
  setTimestamp(value: number): VideoMessageMetadata;

  getTargetDurationSeconds(): number;
  setTargetDurationSeconds(value: number): VideoMessageMetadata;

  getActualDurationSeconds(): number;
  setActualDurationSeconds(value: number): VideoMessageMetadata;

  getThumbnail(): Uint8Array | string;
  getThumbnail_asU8(): Uint8Array;
  getThumbnail_asB64(): string;
  setThumbnail(value: Uint8Array | string): VideoMessageMetadata;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VideoMessageMetadata.AsObject;
  static toObject(includeInstance: boolean, msg: VideoMessageMetadata): VideoMessageMetadata.AsObject;
  static serializeBinaryToWriter(message: VideoMessageMetadata, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VideoMessageMetadata;
  static deserializeBinaryFromReader(message: VideoMessageMetadata, reader: jspb.BinaryReader): VideoMessageMetadata;
}

export namespace VideoMessageMetadata {
  export type AsObject = {
    id: string,
    title: string,
    description: string,
    createdAt: string,
    createdBy: string,
    size: number,
    duration: number,
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
  setMessageId(value: string): GetVideoMessageRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetVideoMessageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetVideoMessageRequest): GetVideoMessageRequest.AsObject;
  static serializeBinaryToWriter(message: GetVideoMessageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetVideoMessageRequest;
  static deserializeBinaryFromReader(message: GetVideoMessageRequest, reader: jspb.BinaryReader): GetVideoMessageRequest;
}

export namespace GetVideoMessageRequest {
  export type AsObject = {
    messageId: string,
  }
}

export class GetVideoMessageMetadataRequest extends jspb.Message {
  getMessageId(): string;
  setMessageId(value: string): GetVideoMessageMetadataRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetVideoMessageMetadataRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetVideoMessageMetadataRequest): GetVideoMessageMetadataRequest.AsObject;
  static serializeBinaryToWriter(message: GetVideoMessageMetadataRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetVideoMessageMetadataRequest;
  static deserializeBinaryFromReader(message: GetVideoMessageMetadataRequest, reader: jspb.BinaryReader): GetVideoMessageMetadataRequest;
}

export namespace GetVideoMessageMetadataRequest {
  export type AsObject = {
    messageId: string,
  }
}

export class ListVideoMessagesRequest extends jspb.Message {
  getRecipientId(): string;
  setRecipientId(value: string): ListVideoMessagesRequest;

  getPageSize(): number;
  setPageSize(value: number): ListVideoMessagesRequest;

  getPageToken(): string;
  setPageToken(value: string): ListVideoMessagesRequest;

  getConversationId(): string;
  setConversationId(value: string): ListVideoMessagesRequest;

  getStartTime(): number;
  setStartTime(value: number): ListVideoMessagesRequest;

  getEndTime(): number;
  setEndTime(value: number): ListVideoMessagesRequest;

  getPage(): number;
  setPage(value: number): ListVideoMessagesRequest;

  getSortBy(): string;
  setSortBy(value: string): ListVideoMessagesRequest;

  getSortOrder(): string;
  setSortOrder(value: string): ListVideoMessagesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListVideoMessagesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListVideoMessagesRequest): ListVideoMessagesRequest.AsObject;
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
    page: number,
    sortBy: string,
    sortOrder: string,
  }
}

export class ListVideoMessagesResponse extends jspb.Message {
  getMessagesList(): Array<VideoMessageMetadata>;
  setMessagesList(value: Array<VideoMessageMetadata>): ListVideoMessagesResponse;
  clearMessagesList(): ListVideoMessagesResponse;
  addMessages(value?: VideoMessageMetadata, index?: number): VideoMessageMetadata;

  getTotalCount(): number;
  setTotalCount(value: number): ListVideoMessagesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListVideoMessagesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListVideoMessagesResponse): ListVideoMessagesResponse.AsObject;
  static serializeBinaryToWriter(message: ListVideoMessagesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListVideoMessagesResponse;
  static deserializeBinaryFromReader(message: ListVideoMessagesResponse, reader: jspb.BinaryReader): ListVideoMessagesResponse;
}

export namespace ListVideoMessagesResponse {
  export type AsObject = {
    messagesList: Array<VideoMessageMetadata.AsObject>,
    totalCount: number,
  }
}

export class DeleteVideoMessageRequest extends jspb.Message {
  getMessageId(): string;
  setMessageId(value: string): DeleteVideoMessageRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteVideoMessageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteVideoMessageRequest): DeleteVideoMessageRequest.AsObject;
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
  setSuccess(value: boolean): DeleteVideoMessageResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteVideoMessageResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteVideoMessageResponse): DeleteVideoMessageResponse.AsObject;
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
  setQuery(value: string): SearchVideoMessagesRequest;

  getRecipientId(): string;
  setRecipientId(value: string): SearchVideoMessagesRequest;

  getPageSize(): number;
  setPageSize(value: number): SearchVideoMessagesRequest;

  getPageToken(): string;
  setPageToken(value: string): SearchVideoMessagesRequest;

  getStartTime(): number;
  setStartTime(value: number): SearchVideoMessagesRequest;

  getEndTime(): number;
  setEndTime(value: number): SearchVideoMessagesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchVideoMessagesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SearchVideoMessagesRequest): SearchVideoMessagesRequest.AsObject;
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
  getMessagesList(): Array<VideoMessageMetadata>;
  setMessagesList(value: Array<VideoMessageMetadata>): SearchVideoMessagesResponse;
  clearMessagesList(): SearchVideoMessagesResponse;
  addMessages(value?: VideoMessageMetadata, index?: number): VideoMessageMetadata;

  getTotalCount(): number;
  setTotalCount(value: number): SearchVideoMessagesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchVideoMessagesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SearchVideoMessagesResponse): SearchVideoMessagesResponse.AsObject;
  static serializeBinaryToWriter(message: SearchVideoMessagesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchVideoMessagesResponse;
  static deserializeBinaryFromReader(message: SearchVideoMessagesResponse, reader: jspb.BinaryReader): SearchVideoMessagesResponse;
}

export namespace SearchVideoMessagesResponse {
  export type AsObject = {
    messagesList: Array<VideoMessageMetadata.AsObject>,
    totalCount: number,
  }
}

