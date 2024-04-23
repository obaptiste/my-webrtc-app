import * as grpc from '@grpc/grpc-js';
import { ServerDuplexStream } from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { PrismaClient, VideoMessage, VideoChunk } from '@prisma/client';
import { VideoMessageMetadata, DeleteVideoMessageRequest, GetVideoMessageRequest, VideoMessageChunk, ListVideoMessagesRequest, ListVideoMessagesResponse, SearchVideoMessagesRequest, SearchVideoMessagesResponse } from '../../generated/proto/video_messaging_pb';
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


async function listVideoMessages(call: ServerUnaryCall<ListVideoMessagesRequest, ListVideoMessagesResponse>, callback: sendUnaryData<ListVideoMessagesResponse>) {
    const request = call.request;
    const page = request.getPage();
    const pageSize = request.getPageSize();
    const sortBy = request.getSortBy();
    const sortOrder = request.getSortOrder();

    try {
        const videoMessages = await prisma.videoMessage.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: {
                [sortBy]: sortOrder,
            },
            include: {
                videoChunks: true,
            },
        });

        const response = new ListVideoMessagesResponse();
        const videoMessageMetadata: VideoMessageMetadata[] = [];

        for (const videoMessage of videoMessages) {
            const metadata = new VideoMessageMetadata();
            metadata.setId(videoMessage.id);
            metadata.setTitle(videoMessage.title);
            metadata.setDescription(videoMessage.description);
            metadata.setCreatedAt(videoMessage.createdAt.toISOString());
            metadata.setCreatedBy(videoMessage.createdBy);
            metadata.setSize(videoMessage.size);
            metadata.setDuration(videoMessage.duration);

            videoMessageMetadata.push(metadata);
        }

        response.setItemsList(videoMessageMetadata);
        response.setTotalCount(await prisma.videoMessage.count());

        callback(null, response);
    } catch (error) {
        callback({
            code: status.INTERNAL,
            message: error.message,
        }, null);
    }
}