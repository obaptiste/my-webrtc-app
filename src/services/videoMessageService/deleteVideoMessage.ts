import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';
import { DeleteVideoMessageRequest, DeleteVideoMessageResponse } from '../../../generated/video_message_pb.d';
import prisma from '../../../lib/prisma';

async function deleteVideoMessage(
    call: ServerUnaryCall<DeleteVideoMessageRequest, DeleteVideoMessageResponse>,
    callback: sendUnaryData<DeleteVideoMessageResponse>
) {
    const request = call.request;
    const messageId = request.getMessageId();

    try {
        const videoMessage = await prisma.videoMessage.findUnique({
            where: { id: messageId },
        });

        if (!videoMessage) {
            callback(
                {
                    code: status.NOT_FOUND,
                    message: 'Video message not found',
                },
                null
            );
            return;
        }

        await prisma.$transaction([
            prisma.videoChunk.deleteMany({
                where: { videoMessageId: messageId },
            }),
            prisma.videoMessage.delete({
                where: { id: messageId },
            }),
        ]);

        const response = new DeleteVideoMessageResponse();
        callback(null, response);
    } catch (error) {
        callback(
            {
                code: status.INTERNAL,
                message: 'An error occurred while deleting the video message.',
            },
            null
        );
        console.error('Error deleting video message:', error);
    }
}

export default deleteVideoMessage;