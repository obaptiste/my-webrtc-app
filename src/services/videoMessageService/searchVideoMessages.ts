import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';
import { SearchVideoMessagesRequest, SearchVideoMessagesResponse, VideoMessageMetadata } from '../../../generated/proto/video_messaging_pb.d.2ts';
import prisma from '../../../lib/prisma';

/**
 * Search video messages.
 *
 * @param call The gRPC call object.
 * @param callback The callback function.
 */

async function searchVideoMessages(call: ServerUnaryCall<SearchVideoMessagesRequest, SearchVideoMessagesResponse>, callback: sendUnaryData<SearchVideoMessagesResponse>) {
    const request = call.request;
    const query = request.getQuery();
    const recipientId = request.getRecipientId();
    const pageSize = request.getPageSize();
    const pageToken = request.getPageToken();
    const startTime = request.getStartTime();
    const endTime = request.getEndTime();

    try {
        const videoMessages = await prisma.videoMessage.findMany({
            where: {
                OR: [
                    { title: { contains: query } },
                    { description: { contains: query } },
                ],
                recipientId: parseInt(recipientId),
            },
            take: pageSize,
            skip: pageToken ? 1 : 0,
            orderBy: {
                createdAt: 'desc',
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

        response.setMessagesList(videoMessageMetadata);
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