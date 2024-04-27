import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { VideoMessageServiceDefinition, VideoMessageServiceHandlers } from "../";
import * as VideoMessageService from "../../videoMessageService";
import { VideoMessageChunk, VideoMessageMetadata } from "../../../../generated/proto/video_messaging_pb";
import prisma from "@/lib/prisma";
import { UploadVideoMessage, GetVideoMessage, DeleteVideoMessage, ListVideoMessages, SearchVideoMessages, GetVideoMessageMetaData } from "../../videoMessageService";
// const PROTO_PATH = "../../lib/proto/video_messaging.proto";
// import { , ListVideoMessages, DeleteVideoMessage, SearchVideoMessages } from "../../videoMessageService"; // Add these import statements
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as unknown as VideoMessageServiceDefinition;
const server = new grpc.Server();

const myServiceHandlers: VideoMessageServiceHandlers = {
    GetVideoMessage,
    UploadVideoMessage,
    GetVideoMessageMetaData, // Add this line
    ListVideoMessages, // Add this line
    DeleteVideoMessage, // Add this line
    SearchVideoMessages, // Add this line
    // SearchVideoMessages, // Add this line

};

server.addService(protoDescriptor.video_messaging.VideoMessageService.service, myServiceHandlers);

server.bindAsync("
    ,
};


; // Add a closing parenthesis here

// Remove this line since myServiceHandlers is not being used
// const myServiceHandlers: VideoMessageServiceHandlers = {

