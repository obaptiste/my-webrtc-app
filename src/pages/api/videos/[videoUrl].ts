import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const videoUrl = req.query.videoUrl as string;

        // Retrieve the video message from the database based on the videoUrl
        const videoMessage = await prisma.videoMessage.findUnique({
            where: { videoUrl: videoUrl },
            include: { videoChunks: true },
        });

        if (!videoMessage) {
            return res.status(404).json({ error: 'Video not found' });
        }

        // Combine the video chunks and serve the video file
        const videoData = await combineVideoChunks(videoMessage.videoChunks);
        res.setHeader('Content-Type', 'video/mp4');
        res.send(videoData);
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}