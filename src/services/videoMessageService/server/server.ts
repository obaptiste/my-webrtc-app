import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { VideoMessageServiceDefinition, VideoMessageServiceHandlers } from "../uploadVideoMessage";
import * as VideoMessageService from "../../videoMessageService";
import { VideoMessageChunk, VideoMessageMetadata } from "../../../../generated/proto/video_messaging_pb";


const server = new grpc.Server();

const metadata = new VideoMessageMetadata();

const myServiceHandlers: VideoMessageServiceHandlers = {
    getVideoMessage: async (call, callback) => {
        callback(null, metadata);
    },

    uploadVideoMessage: async (call, callback) => {
        const videoMessage = await VideoMessageService.uploadVideoMessage((call as grpc.ServerDuplexStream<VideoMessageChunk, VideoMessageMetadata>).request);
        callback(null, videoMessage, {});
    }
}
