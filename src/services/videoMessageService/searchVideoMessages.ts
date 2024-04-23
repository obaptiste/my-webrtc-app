import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';
import { SearchVideoMessagesRequest, SearchVideoMessagesResponse, VideoMessageMetadata } from '../../../generated/proto/video_messaging_pb';
import prisma, { VideoMessage } from '@prisma/client';

const prisma = new Prisma();

async function searchVideoMessages(call: ServerUnaryCall<SearchVideoMessagesRequest, SearchVideoMessagesResponse>, callback: sendUnaryData<SearchVideoMessagesResponse>) {
    const request = call.request;
    const query = request.getQuery();
    const page = request.getPage();
    const pageSize = request.getPageSize();
    const sortBy = request.getSortBy();
    const sortOrder = request.getSortOrder();

    try {
        const videoMessages = await prisma.videoMessage.findMany({
            where: {
                OR: [
                    { title: { contains: query } },
                    { description: { contains: query } },
                ],
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: {
                [sortBy]: sortOrder,
            },
            include: {
                videoChunks: true,
            },
        });

        const response = new SearchVideoMessagesResponse();
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
        response.setTotalCount(videoMessageMetadata.length);

        callback(null, response);
    } catch (error) {
        callback({
            code: status.INTERNAL,
            message: (error as Error).message,
        }, null);
    }
}

export default searchVideoMessages;