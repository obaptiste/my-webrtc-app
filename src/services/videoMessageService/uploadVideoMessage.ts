import { ServerDuplexStream } from '@grpc/grpc-js';
import { VideoMessageChunk } from '../../../generated/proto/video_messaging_pb';
import prisma from '../../../lib/prisma';

/**
 * Uploads a video message to the database.
 *
 * @param call The gRPC call object.
 */

async function uploadVideoMessage(call: ServerDuplexStream<VideoMessageChunk, VideoMessageChunk>) {
    const videoChunks: VideoMessageChunk[] = [];

    try {
        call.on('data', (chunk: VideoMessageChunk) => {
            videoChunks.push(chunk);
        });

        call.on('end', async () => {
            const messageId = videoChunks[0].getMessageId();
            const videoMessage = await prisma.videoMessage.create({
                data: {
                    id: messageId,
                    title: 'Video Message Title',
                    description: 'Video Message Description',
                    createdAt: new Date(),
                    createdBy: 'User ID',
                    size: 1024,
                    duration: 60,
                    senderId: 1,
                    recipientId: 2,
                    // Add other required fields
                },
            });

            const chunkData = await Promise.all(
                videoChunks.map(async (chunk, index) => {
                    const data = chunk.getData();
                    return prisma.videoChunk.create({
                        data: {
                            videoMessageId: messageId,
                            index,
                            data: Buffer.from(data),
                        },
                    });
                }),
            );

            const response = new VideoMessageChunk();
            response.setMessageId(messageId);
            response.setChunkIndex(-1); // Indicate end of stream
            call.write(response);
            call.end();
        });

        call.on('error', (error) => {
            console.error('Error uploading video message:', error);
            call.end();
        });
    } catch (error) {
        console.error('Error uploading video message:', error);
        call.end();
    }
}

export default uploadVideoMessage;