import { useState, useEffect, useRef } from "react";

const VideoCall = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });
  }, []);

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted />
    </div>
  );
};

export default VideoCall;
