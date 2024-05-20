// WebSocket Server Route

import { WebSocketServer, WebSocket } from 'ws';
import { PrismaClient } from '@prisma/client';
import { IncomingMessage } from 'http';
import Server from 'ws';
import type { Server as HTTPServer } from 'http';
import { v4 as uuidv4 } from 'uuid'; // Import the uuidv4 function from the uuid package
import { NextApiRequest, NextApiResponse } from 'next';




interface WebSocketData {
    type: 'metadata' | 'videoChunk';
    metadata?: any;
    chunkIndex?: number;
    data?: any;
}

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse & { socket: { server?: { ws?: WebSocketServer } } }) {
    if (res.socket.server?.ws) {
        //Server is already running
        return res.end();
    }

    const wss = new WebSocketServer({
        noServer: true,
        clientTracking: true,
        path: '/api/websockets',
    });

    res.socket.server.ws = wss as WebSocketServer;

    wss.on('connection', async (ws: WebSocket) => {
        let videoMessageId: string | null = null;

        ws.on('message', async (message) => {
            const data = JSON.parse(message.toString()) as WebSocketData;

            if (data.type === 'metadata') {
                // Receive and save metadata to Prisma
                const { title, description } = data.metadata;
                const videoMessage = await prisma.videoMessage.create({
                    data: {
                        id: `${title}_meta_${uuidv4()}`, // Use the uuidv4 function to generate a unique ID
                        title: title,
                        description: `video description, ${description}`,
                        createdBy: "user currently logged in",
                        createdAt: new Date().toISOString(),
                        senderId: 1 as never, // User ID
                        recipientId: 2 as never, // User ID
                        duration: 0,
                        ...data.metadata
                    }
                });
                videoMessageId = videoMessage.id;
                ws.send(JSON.stringify({ type: 'metadataSaved', videoMessageId }));
            } else if (data.type === 'videoChunk' && videoMessageId) {
                // Save video chunk to Prisma
                const videoChunk = await prisma.videoChunk.create({
                    data: {
                        id: uuidv4(),
                        videoMessageId: videoMessageId,
                        index: data.chunkIndex,
                        data: data.data
                    }
                });
                ws.send(JSON.stringify({ type: 'chunkSaved', chunkIndex: data.chunkIndex }));
            }
        });

        ws.on('close', () => {
            console.log('WebSocket connection closed');
            prisma.$disconnect();
        });
    })
};
