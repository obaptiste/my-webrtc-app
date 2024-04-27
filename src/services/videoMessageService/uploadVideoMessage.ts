import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { VideoMessageChunk, VideoMessageMetadata, GetVideoMessageRequest, ListVideoMessagesRequest, ListVideoMessagesResponse, DeleteVideoMessageRequest, DeleteVideoMessageResponse, SearchVideoMessagesRequest, SearchVideoMessagesResponse } from '../../../generated/proto/video_messaging_pb';
import prisma from '../../../lib/prisma';
import { ServiceClientConstructor } from '@grpc/grpc-js';
import { ServerDuplexStream } from '@grpc/grpc-js';
import StatusObject from '../../../node_modules/@grpc/grpc-js/build/src/call';
import type { StatusObject as StatusObjectGrpcJs } from '@grpc/grpc-js';
import { VideoMessage } from '@prisma/client';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { VideoMessageServiceHandlers } from './updateVideoMessage';
import storeVideoPermanently from '../../../lib/storeVideoPermanently';
import getVideoMessageMetaData from './getVideoMessageMetaData';

const PROTO_PATH = '../../lib/proto/video_messaging.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
// Add the import statement above




/**
 * Uploads a video message to the database.
 *
 * 
 * 
 * 
 * @param call The gRPC call object.
 */




const uploadVideoMessage: VideoMessageServiceHandlers['UploadVideoMessage'] = async (call: ServerDuplexStream<VideoMessageChunk, VideoMessageMetadata>) => {
    const videoChunks: VideoMessageChunk[] = [];

    let messageId = '';

    try {
        call.on('data', (chunk: VideoMessageChunk) => {
            if (!messageId) {
                messageId = chunk.getMessageId();
            }
            videoChunks.push(chunk);
        });

        call.on('end', async () => {
            const tempFilePath = ``;
            const messageId = videoChunks[0].getMessageId();
            const vidUrl = await storeVideoPermanently(tempFilePath, messageId);
            // const generateVideoUrl = (messageId: string): string => {
            //     // Generate the video URL based on the messageId
            //     return `https://example.com/videos/${messageId}.mp4`;
            // };
            const videoMessage: VideoMessage = await prisma.videoMessage.upsert({
                where: {
                    id: messageId,
                },
                update: {
                    videoUrl: vidUrl,
                    //metadata:getVideoMessageMetadata(messageId),
                },
                create: {
                    id: messageId,
                    videoUrl: vidUrl,
                    title: '',
                    description: '',
                    createdBy: '',
                    size: 0,
                    duration: 0,
                    senderId: 0, // Add sender property
                    recipientId: 0, // Add recipient property
                },
            });

            const response = new VideoMessageMetadata();
            response.setId(videoMessage.id);
            response.setTitle(videoMessage.title);
            response.setDescription(videoMessage.description);
            response.setCreatedBy(videoMessage.createdBy);
            call.write(response);
            call.end();
        })

    } catch (error) {
        console.error('Error uploading video message:', error);
        call.emit('error'), StatusObject.callErrorFromStatus({
            code: grpc.status.INTERNAL,
            details: 'Error uploading video message',
            metadata: new grpc.Metadata(),
        }, 'Error uploading video message');
    }


};

export default uploadVideoMessage;