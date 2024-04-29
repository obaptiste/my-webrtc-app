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
import { VideoNotFoundError, FileNotFoundError } from '@/lib/errors';


const prisma = new PrismaClient();


const PROTO_PATH = '../../lib/proto/video_messaging.proto';

const videoChunks: VideoChunk[] = [];


const getVideoMessage: VideoMessageServiceHandlers['GetVideoMessage'] = async (
    call: ServerWritableStream<GetVideoMessageRequest, VideoMessageChunk> // Update the type of 'call' parameter
) => {
    try {
        const messageId = (call as any).request.getMessageId();



        const videoMessage = await prisma.videoMessage.findUnique({
            where: { id: messageId },
            include: { videoChunks: true },
        });

        if (!videoMessage) {
            throw new VideoNotFoundError('Video not found');
        }

        if (videoMessage?.videoUrl && !fs.existsSync(videoMessage.videoUrl)) {
            throw new FileNotFoundError('Video file not found');
        }

        const videoStream = videoMessage && fs.createReadStream(videoMessage.videoUrl);

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
            console.error('Error reading video file:', error); // Log the error
            call.emit('error', status.INTERNAL, 'failed to read video'); // Emit an error to the client
            call.end();
        });

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