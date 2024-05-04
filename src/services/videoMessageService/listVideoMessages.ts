import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';
import { ListVideoMessagesRequest, ListVideoMessagesResponse, VideoMessageMetadata } from '../../../generated/video_message_pb.d';
import prisma from '../../../lib/prisma';

async function listVideoMessages(
    call: ServerUnaryCall<ListVideoMessagesRequest, ListVideoMessagesResponse>,
    callback: sendUnaryData<ListVideoMessagesResponse>
) {
    const request = call.request;
    const page = request.getPage();
    const pageSize = request.getPageSize();
    const sortBy = request.getSortBy();
    const sortOrder = request.getSortOrder();

    try {
        const [videoMessages, totalCount] = await prisma.$transaction([
            prisma.videoMessage.findMany({
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { [sortBy]: sortOrder },
                include: { videoChunks: true },
            }),
            prisma.videoMessage.count(),
        ]);

        const response = new ListVideoMessagesResponse();
        const videoMessageMetadata: VideoMessageMetadata[] = videoMessages.map((videoMessage) => {
            const metadata = new VideoMessageMetadata();
            metadata.setId(videoMessage.id);
            metadata.setTitle(videoMessage.title);
            metadata.setDescription(videoMessage.description);
            metadata.setCreatedAt(videoMessage.createdAt.toISOString());
            metadata.setCreatedBy(videoMessage.createdBy);
            metadata.setSize(videoMessage.size);
            metadata.setDuration(videoMessage.duration);
            return metadata;
        });

        response.setMessagesList(videoMessageMetadata);
        response.setTotalCount(totalCount);
        callback(null, response);
    } catch (error) {
        callback(
            {
                code: status.INTERNAL,
                message: 'An error occurred while listing video messages.',
            },
            null
        );
        console.error('Error listing video messages:', error);
    }
}

export default listVideoMessages;