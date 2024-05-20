import type { NextApiRequest, NextApiResponse } from 'next';
import type { Server as HTTPServer } from 'http';
import { WebSocketServer } from 'ws';

declare module 'next' {
    interface NextApiRequest {
        socket: {
            server: HTTPServer & {
                ws?: WebSocketServer;
            };
        };
    }
}

declare module 'nextjs-websockets' {
    export interface WebSocketData {
        type: 'metadata' | 'videoChunk';
        metadata?: any;
        chunkIndex?: number;
        data?: any;
    }

}
