// function that gets the metadata of a video message

import { VideoMessageMetadata } from "@/generated/proto/video_messaging_pb";
import { ServerUnaryCall } from "@grpc/grpc-js";
import { VideoMessageServiceHandlers } from "@/src/services/videoMessageService/updateVideoMessage"; // Import the necessary type declaration

import prisma from "@/lib/prisma";

const getVideoMessageMetaData: VideoMessageServiceHandlers['getVideoMessageMetaData'] = async (
    request: VideoMessageMetadata,
    call: ServerUnaryCall<VideoMessageMetadata, VideoMessageMetadata>
) {