import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import {
  VideoMessageServiceDefinition,
  VideoMessageServiceHandlers,
} from "../";

import {
  VideoMessageChunk,
  VideoMessageMetadata,
  GetVideoMessageRequest,
  ListVideoMessagesRequest,
  ListVideoMessagesResponse,
  DeleteVideoMessageRequest,
  DeleteVideoMessageResponse,
  SearchVideoMessagesRequest,
  SearchVideoMessagesResponse,
} from "@/generated/video_message_pb";
import deleteVideoMessage from "../deleteVideoMessage";
import getVideoMessage from "../getVideoMessage";
import listVideoMessages from "../listVideoMessages";
import searchVideoMessages from "../searchVideoMessages";
import uploadVideoMessage from "../uploadVideoMessage";
import { FileNotFoundError, VideoNotFoundError } from "@/lib/errors";

const PROTO_PATH = "../../lib/proto/video_messaging.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}); // Load the .proto file
const protoDescriptor = grpc.loadPackageDefinition(
  packageDefinition,
) as unknown as VideoMessageServiceDefinition;

const server = new grpc.Server();

const myServiceHandlers: VideoMessageServiceHandlers = {
  UploadVideoMessage: async (
    call: grpc.ServerDuplexStream<VideoMessageChunk, VideoMessageMetadata>,
  ) => {
    try {
      await uploadVideoMessage(call);
      return call;
    } catch (error) {
      if (error instanceof FileNotFoundError) {
        call.emit("error", {
          code: grpc.status.NOT_FOUND,
          "Error with video file": (error as Error).message,
        });
      } else {
        call.emit("error", {
          code: grpc.status.INTERNAL,
          "Unexpected error occured": (error as Error).message,
        });
      }
    }
  },
  GetVideoMessage: async (
    call: grpc.ServerWritableStream<GetVideoMessageRequest, VideoMessageChunk>,
  ) => {
    try {
      await getVideoMessage(call);
    } catch (error) {
      if (
        error instanceof VideoNotFoundError ||
        error instanceof FileNotFoundError
      ) {
        call.emit("error", {
          code: grpc.status.NOT_FOUND,
          "Error with video file": (error as Error).message,
        });
      } else {
        call.emit("error", {
          code: grpc.status.INTERNAL,
          "Unexpected error occured": (error as Error).message,
        });
      }
    }
  },
  ListVideoMessages: (
    call: grpc.ServerUnaryCall<
      ListVideoMessagesRequest,
      ListVideoMessagesResponse
    >,
    callback: grpc.sendUnaryData<ListVideoMessagesResponse>,
  ) => {
    listVideoMessages(call, callback);
  },
  DeleteVideoMessage: (
    call: grpc.ServerUnaryCall<
      DeleteVideoMessageRequest,
      DeleteVideoMessageResponse
    >,
    callback: grpc.sendUnaryData<DeleteVideoMessageResponse>,
  ) => {
    deleteVideoMessage(call, callback);
  },
  SearchVideoMessages: (
    call: grpc.ServerUnaryCall<
      SearchVideoMessagesRequest,
      SearchVideoMessagesResponse
    >,
    callback: grpc.sendUnaryData<SearchVideoMessagesResponse>,
  ) => {
    searchVideoMessages(call, callback);
  },
};
server.addService(
  protoDescriptor.VideoMessagingService as unknown as grpc.ServiceDefinition<grpc.UntypedServiceImplementation>,
  myServiceHandlers as unknown as grpc.UntypedServiceImplementation,
); // Add a closing parenthesis here

// Remove this line since myServiceHandlers is not being used
// const myServiceHandlers: VideoMessageServiceHandlers = {
