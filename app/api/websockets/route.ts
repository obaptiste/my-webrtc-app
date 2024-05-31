import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const uploadDirectory = path.join(process.cwd(), 'public', 'uploads'); // Adjust path as needed
fs.mkdirSync(uploadDirectory, { recursive: true });

let io: Server | null = null;

export default function handler(req: any, res: any) {
    if (res.socket.server.io) {
        // Server is already running
        res.end();
        return;
    }

    const httpServer = res.socket.server;
    io = new Server(httpServer, {
        path: '/api/socket',
    });

    res.socket.server.io = io;

    io.on('connection', async (socket) => {
        let videoMessageId: string | null = null;
        let videoFilename: string | null = null;
        let writeStream: fs.WriteStream | null = null; // Stream for writing to file

        socket.on('metadata', async (data) => {
            // Receive and save metadata to Prisma
            const { title, description, createdBy, senderId, recipientId, size, duration } = data.metadata;
            const videoMessage = await prisma.videoMessage.create({
                data: { title, description, createdBy, size, duration, videoUrl: '', senderId, recipientId },
            });
            videoMessageId = videoMessage.id;
            socket.emit('metadataSaved', { videoMessageId });
            // Generate a unique filename based on videoMessageId
            videoFilename = `${videoMessageId}.webm`; // Or your preferred format
            writeStream = fs.createWriteStream(path.join(uploadDirectory, videoFilename));
        });

        socket.on('videoChunk', async (data) => {
            if (videoMessageId && writeStream) {
                // Receive and save video chunk to storage
                const { chunkIndex, data: chunkData } = data;
                const buffer = Buffer.from(chunkData, 'base64'); // Convert base64 to buffer

                // Write chunk to file
                writeStream.write(buffer, (err) => {
                    if (err) {
                        console.error('Error writing chunk to file:', err);
                        socket.emit('error', { message: 'Error writing chunk to file' });
                    }
                });

                // Send progress update
                socket.emit('chunkSaved', { chunkIndex });

                // Check if last chunk
                if (data.isLastChunk) {
                    writeStream.end();
                    // Update videoMessage with video URL
                    const videoUrl = `/uploads/${videoFilename}`;
                    await prisma.videoMessage.update({
                        where: { id: videoMessageId },
                        data: { videoUrl },
                    });
                    socket.emit('uploadComplete', { videoUrl });
                }
            }
        });

        // Clean up when the connection ends
        socket.on('disconnect', () => {
            if (writeStream) {
                writeStream.close();
            }
        });
    });

    res.end();
}