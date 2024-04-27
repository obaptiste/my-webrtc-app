import * as grpc from '@grpc/grpc-js';
import { ServerDuplexStream, ServerWritableStream } from '@grpc/grpc-js'; // Add import for ServerWritableStream
import * as protoLoader from '@grpc/proto-loader';
import { PrismaClient, VideoMessage, VideoChunk } from '@prisma/client';
import { VideoMessageMetadata, DeleteVideoMessageRequest, GetVideoMessageRequest, VideoMessageChunk, ListVideoMessagesRequest, ListVideoMessagesResponse, SearchVideoMessagesRequest, SearchVideoMessagesResponse } from '../../../generated/proto/video_messaging_pb.d';
//import { VideoMessageChunk } from '../../generated/proto/video_messaging_pb';
import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';
import { VideoMessageServiceHandlers } from '@/src/services/videoMessageService';
import StatusObject from '../../../node_modules/@grpc/grpc-js/build/src/call';
import fs from 'fs';


const prisma = new PrismaClient();


const PROTO_PATH = '../../lib/proto/video_messaging.proto';

const videoChunks: VideoChunk[] = [];


const getVideoMessage: VideoMessageServiceHandlers['GetVideoMessage'] = async (
    call: ServerWritableStream<GetVideoMessageRequest, VideoMessageChunk> // Update the type of 'call' parameter
) => {
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
            const videoStream = fs.createReadStream(videoMessage.videoUrl);

            let chunkIndex = 0;

            videoStream.on('data', (chunk) => {
                const videoChunk = new VideoMessageChunk();
                videoChunk.setMessageId(messageId);
                videoChunk.setChunkIndex(chunkIndex);
                videoChunk.setData(chunk);
                call.write(videoChunk);
                chunkIndex++;
            });

            videoStream.on('end', () => {
                call.end();
            });

            videoStream.on('error', (error) => {
                call.emit('error', error);
            });
        }

        for (const chunk of videoMessage.videoChunks) {
            const videoMessageChunk = new VideoMessageChunk(); // Remove the argument from the constructor
            videoMessageChunk.setMessageId(messageId); // Set the messageId using the setter method
            videoMessageChunk.setChunkIndex(chunk.index);
            videoMessageChunk.setData(chunk.data);
            call.write(videoMessageChunk);
        }

    } catch (error) {
        console.error('Error fetching video message:', error);
        call.emit('error', StatusObject.callErrorFromStatus({
            code: grpc.status.INTERNAL,
            details: 'Error uploading video message',
            metadata: new grpc.Metadata(),
        }, 'Error uploading video message'));
    }
}

// Export the getVideoMessage function as the default export of the module


export default getVideoMessage;