import { useState, useEffect } from 'react';
import { VideoMessageMetadata } from '../../generated/video_message_pb';
import VideoUploadManager from '../components/VideoUploadManager';
import * as grpc from 'grpc-web';
import { Observable } from 'rxjs';


interface UploadStatus {
    progress?: number;
    isUploading: boolean;
    error?: Error;
}

const useVideoUpload = () => {
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ isUploading: false });
    const videoUploadManager = new VideoUploadManager();

    const startUpload = async (videoBlob: Blob, metadata: VideoMessageMetadata) => {
        setUploadStatus({ isUploading: true });

        try {
            // Return a new Promise
            return new Promise(async (resolve, reject) => {
                (await videoUploadManager.uploadVideo(videoBlob, metadata))
                    .subscribe({
                        next: (progress) => setUploadStatus({ progress, isUploading: true }),
                        error: (error: grpc.RpcError) => {
                            setUploadStatus({ error: new Error(error.message), isUploading: false });
                            reject(error);
                        },
                        complete: () => {
                            setUploadStatus({ isUploading: false });
                            resolve("Upload completed successfully");
                        }
                    });
            });
        } catch (error) {
            setUploadStatus({ error: new Error(error as string), isUploading: false });
        }
    };

    return { uploadStatus, startUpload };
};

export default useVideoUpload; 