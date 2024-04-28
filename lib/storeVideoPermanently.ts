import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { VideoMessageChunk } from '../generated/proto/video_messaging_pb';

async function storeVideoLocally(videoChunks: VideoMessageChunk[], messageId: string): Promise<string> {
    const videoDir = path.join(__dirname, '..', '..', '..', 'uploads', 'videos');
    const videoFileName = `${messageId}.webm`; // Adjust the file extension based on your video format
    const videoPath = path.join(videoDir, videoFileName);

    // Create the video directory if it doesn't exist
    if (!fs.existsSync(videoDir)) {
        fs.mkdirSync(videoDir, { recursive: true });
    }

    // Write the video chunks to the file
    const writeStream = fs.createWriteStream(videoPath);
    for (const chunk of videoChunks) {
        await new Promise<void>((resolve, reject) => {
            writeStream.write(chunk.getData(), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
    writeStream.end();

    // Generate the video URL
    const videoUrl = `/uploads/videos/${videoFileName}`;

    return videoUrl;
}

export default storeVideoLocally;