import * as grpc from '@grpc/grpc-js';
import {
    VideoMessageChunk,
    VideoMessageMetadata,
} from '../../../generated/video_message_pb';
import { VideoMessageServiceHandlers } from './'
import prisma from '../../../lib/prisma';
import { ServerDuplexStream } from '@grpc/grpc-js';
import { VideoMessage } from '@prisma/client';
import storeVideoPermanently from '../../../lib/storeVideoPermanently';
import { PrismaClient } from '@prisma/client';



const prismaClient = new PrismaClient();


export const uploadVideoMessage: VideoMessageServiceHandlers['UploadVideoMessage'] = async (
    call: ServerDuplexStream<VideoMessageChunk, VideoMessageMetadata>
) => {
    const videoChunks: VideoMessageChunk[] = [];
    let messageId: string = '';
    let chunksReceived = 0;


    try {
        call.on('data', (chunk: VideoMessageChunk) => {
            // Validate chunk size and order if needed
            if (chunk.getChunkIndex() !== videoChunks.length) {
                throw new Error('Invalid chunk order');
            }
            videoChunks.push(chunk);
            chunksReceived++;
            if (chunksReceived % 10 === 0) {
                const progressMetadata = new VideoMessageMetadata();
                progressMetadata.setId(messageId);
                call.write(progressMetadata);
            }
        });

        call.on('end', async () => {
            if (videoChunks.length === 0) {
                throw new Error('No video chunks received');
            }
            messageId = videoChunks[0].getMessageId();
            const vidUrl = await storeVideoPermanently(videoChunks, messageId);

            const videoMessage: VideoMessage = await prismaClient.videoMessage.upsert({
                where: { id: messageId },
                update: { videoUrl: vidUrl },
                create: {
                    id: messageId,
                    videoUrl: vidUrl,
                    title: '',
                    description: '',
                    createdBy: '',
                    size: getTotalChunkSize(videoChunks),
                    duration: 0,
                    senderId: 0,
                    recipientId: 0,
                },
            });

            const response = new VideoMessageMetadata();
            response.setId(videoMessage.id);
            response.setTitle(videoMessage.title);
            response.setDescription(videoMessage.description);
            response.setCreatedBy(videoMessage.createdBy);
            // Set additional metadata fields if needed
            call.write(response);
            call.end();
        });
    } catch (error) {
        console.error('Error uploading video message:', error);
        call.emit('error', {
            code: grpc.status.INTERNAL,
            message: 'Error uploading video message',
        });
    }
};

// Helper function to calculate total chunk size
function getTotalChunkSize(chunks: VideoMessageChunk[]): number {
    return chunks.reduce((total, chunk) => total + chunk.getData().length, 0);
}

// Error handling function
function handleError(call: ServerDuplexStream<any, any>, error: Error) {
    console.error('Error in uploadVideoMessage:', error);
    call.emit('error', {
        code: grpc.status.INTERNAL,
        message: 'An error occurred while uploading the video message',
    });
}

export default uploadVideoMessage;