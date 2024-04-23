import * as grpc from '@grpc/grpc-js';
import { ServerDuplexStream } from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { PrismaClient, VideoMessage, VideoChunk } from '@prisma/client';
import { VideoMessageMetadata, DeleteVideoMessageRequest, GetVideoMessageRequest, VideoMessageChunk, ListVideoMessagesRequest, ListVideoMessagesResponse, SearchVideoMessagesRequest, SearchVideoMessagesResponse } from '../../../generated/proto/video_messaging_pb';
//import { VideoMessageChunk } from '../../generated/proto/video_messaging_pb';
import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';

const prisma = new PrismaClient();


const PROTO_PATH = '../../lib/proto/video_messaging.proto';

const videoChunks: VideoChunk[] = [];


async function getVideoMessage(
    call: ServerDuplexStream<GetVideoMessageRequest, VideoMessageChunk>
): Promise<void> {
    const messageId = (call as any).request.getMessageId();

    try {
        const videoMessage = await prisma.videoMessage.findUnique({
            where: { id: messageId },
            include: { videoChunks: true },
        });

        if (!videoMessage) {
            const error: any = new Error('Message not found');
            error.code = grpc.status.NOT_FOUND;
            call.emit('error', error);
            return;
        }

        if (videoMessage && videoMessage.videoChunks) {
            for (const chunk of videoMessage.videoChunks) {
                const videoMessageChunk = new VideoMessageChunk(); // Remove the argument from the constructor
                videoMessageChunk.setMessageId(messageId); // Set the messageId using the setter method
                videoMessageChunk.setChunkIndex(chunk.index);
                videoMessageChunk.setData(chunk.data);
                call.write(videoMessageChunk);
            }

        }

        call.end();
    } catch (error) {
        call.emit('error', error);
    }
}

export { getVideoMessage };