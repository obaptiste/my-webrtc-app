// function that gets the metadata of a video message

import * as grpc from '@grpc/grpc-js';
import StatusObject from '@grpc/grpc-js/build/src/call';
import { VideoMessageMetadata } from "@/generated/proto/video_messaging_pb";
import { ServerUnaryCall, ServerWritableStream } from "@grpc/grpc-js";
import { VideoMessageServiceHandlers } from "@/src/services/videoMessageService"; // Import the necessary type declaration
import { GetVideoMessageRequest } from "@/generated/proto/video_messaging_pb"; // Import the necessary type declaration
import fs from 'fs';
import prisma from "@/lib/prisma";



async function getVideoMessageMetaData(messageId: string): Promise<VideoMessageMetadata | null | grpc.StatusObject> {
    try {
        const existingVideo = await prisma.videoMessage.findUnique({
            where: { id: messageId },
        });
        if (!existingVideo) {
            return null;
        }

        const metadata = new VideoMessageMetadata();
        metadata.setId(existingVideo.id);
        metadata.setSenderId(`${existingVideo.senderId}`);
        metadata.setRecipientId(`${existingVideo.recipientId}`);
        return metadata;
    } catch (error) {
        console.error('Error fetching video message metadata', error);
        throw error as { code: grpc.status.INTERNAL, details: 'Internal server error' };
    }
}
export default getVideoMessageMetaData;
