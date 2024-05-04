import { VideoMessageMetadata } from '../../generated/video_message_pb';

/**@param {Blob} videoBlob */
/**@param {VideoMessageMetadata} metadata */
/**@pparam {Promise<void>} */
/** @param {Blob} videoBlob */
/** @param {videoBlob} videoBlob */
/** @param {metadata} metadata */


export interface IVideoRecorderProps {
    onStartRecording: () => void;
    onStopRecording: (videoBlob: Blob) => void;
}

export interface IVideoUploadManager {
    uploadVideo: (videoBlob: Blob, metadata: VideoMessageMetadata) => Promise<void>;
};
