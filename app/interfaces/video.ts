import { VideoMessageMetadata } from "../../generated/video_message_pb";
import { Observable } from "rxjs";

/**
 * Interface for video recorder component props.
 */
export interface IVideoRecorderProps {
  isRecording: boolean;
  recordedVideo: Blob | null;
  uploadProgress: number;
  uploadState: "idle" | "uploading" | "success" | "error";
  uploadMessage: string | null;
  /** Callback function triggered when recording starts. */
  onStartRecording: () => void;
  /** Callback function triggered when recording stops.  */
  onStopRecording: () => void;
  /** Callback function triggered when recording fails. */
  onRecordingComplete: (videoBlob: Blob) => void;
  onUploadProgress: (progress: number) => void;
  onUploadStarted: () => void;
  onUploadComplete: () => void;
  retryRecording: () => void;
  canRetry: boolean;
  showOverlay: boolean;
  countdown: number | null;
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
  uploadVideo: (
    videoBlob: Blob,
    metadata: VideoMessageMetadata,
  ) => Promise<Observable<T>>;
}
