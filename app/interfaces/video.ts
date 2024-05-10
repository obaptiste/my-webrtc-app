import { VideoMessageMetadata } from '../../generated/video_message_pb';
import { Observable } from 'rxjs';

/** 
 * Interface for video recorder component props.
 */
export interface IVideoRecorderProps {
    /** Callback function triggered when recording starts. */
    onStartRecording: () => void;
    /** Callback function triggered when recording stops.  */
    onStopRecording: (videoBlob: Blob) => void;
    /** Callback function triggered when recording fails. */
    //onRecordingFailed: (error: Error) => void;
    onRecordingComplete: (videoBlob: Blob) => void;
    onUploadProgress: (progress: number) => void;
    onUploadStarted: (videoBlob: Blob, metadata: VideoMessageMetadata) => Promise<unknown>;


}

/**
 * Interface for the video upload manager. 
 */
export interface IVideoUploadManager<T> {
    /**
     * Uploads a video to the server.
     * @param videoBlob The video blob to upload.
     * @param metadata Metadata associated with the video. 
     * @returns A promise that resolves when the upload is complete. 
     */
    uploadVideo: (videoBlob: Blob, metadata: VideoMessageMetadata) => Promise<Observable<T>>;
};
