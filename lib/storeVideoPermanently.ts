import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';


// ... in your 'storeVideoPermanently' function 
async function storeVideoPermanently(tempFilePath: string, id: string): Promise<string> {
    const uploadsDir = './uploads';
    const filename = `${uuidv4()}.mp4`;
    const destinationPath = path.join(uploadsDir, filename);

    // Ensure the uploads directory exists 
    fs.mkdirSync(uploadsDir, { recursive: true });

    // Move the file from the temporary location to the uploads directory
    fs.renameSync(tempFilePath, destinationPath);

    // Return the relative path for URL construction 
    return `/videos/${filename}`;
}


export default storeVideoPermanently;