// src/types/VideoData.ts
export interface VideoData {
  blob: Blob | null; // The recorded video data as a Blob
  metadata?: {
    // Optional metadata
    title: string;
    description: string;
    // ... other fields
  };
}
