import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';
import { ListVideoMessagesRequest, ListVideoMessagesResponse, VideoMessageMetadata } from '../../../generated/proto/video_messaging_pb';
import setItemsList from 'google-protobuf'; // Add this line

import prisma from '../../../lib/prisma';

async function listVideoMessages(call: ServerUnaryCall<ListVideoMessagesRequest, ListVideoMessagesResponse>, callback: sendUnaryData<ListVideoMessagesResponse>) {
    const request = call.request;
    const page = (request.getPage as () => number)();
    const pageSize = request.getPageSize();
    const sortBy = (request.getSortBy as () => string)();
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
            message: error as string,
        }, null);
    }
}