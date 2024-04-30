import Image from "next/image";
import VideoRecorder from "../app/components/VideoRecorder";

export default function Home() {
  const handleRecordingComplete = (videoBlob: Blob) => {
    // Handle the recorded video blob, e.g., upload to server, display preview, etc
    console.log("Recording complete:", videoBlob);
  };

  return (
    <div>
      <VideoRecorder onRecordingComplete={handleRecordingComplete} />
    </div>
  );
}
