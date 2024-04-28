import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { VideoMessageServiceDefinition, VideoMessageServiceHandlers } from "../";
import prisma from "@/lib/prisma";
import { UploadVideoMessage, GetVideoMessage, DeleteVideoMessage, ListVideoMessages, SearchVideoMessages } from "../../videoMessageService";


const PROTO_PATH = "../../lib/proto/video_messaging.proto";
// import { GetVideoMessage, GetVideoMessageMetaData } from "../../videoMessageService"; // Add this import statement


// import { , ListVideoMessages, DeleteVideoMessage, SearchVideoMessages } from "../../videoMessageService"; // Add these import statements
const packageDefinition = protoLoader.loadSync(PROTO_PATH); // Load the .proto file
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as unknown as VideoMessageServiceDefinition;

const server = new grpc.Server();

const myServiceHandlers: VideoMessageServiceHandlers = {
    UploadVideoMessage: UploadVideoMessage,
    GetVideoMessage: GetVideoMessage,
    ListVideoMessages: ListVideoMessages,
    DeleteVideoMessage: DeleteVideoMessage,
    SearchVideoMessages: SearchVideoMessages,
};

server.addService(protoDescriptor.VideoMessagingService.service, myServiceHandlers);

server.bindAsync("
    ,
};


; // Add a closing parenthesis here

// Remove this line since myServiceHandlers is not being used
// const myServiceHandlers: VideoMessageServiceHandlers = {

