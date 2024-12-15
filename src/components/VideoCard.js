import React, { useEffect, useState } from "react";
import ImageWithBoundingBoxes from './ImageWithBoundingBoxes';

function VideoCard({ video, detections }) {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % video.frames.length);
    }, 300); // Simula el cambio de frames (300ms)
    return () => clearInterval(interval);
  }, [video.frames.length]);

  const currentFrameDetections = detections[currentFrame];

  return (
    <div className="video-card">
      <ImageWithBoundingBoxes
        imageUrl={video.frames[currentFrame]}  // Frame actual del video
        detections={currentFrameDetections || []}  // Las detecciones del frame actual
      />
      <h3>{video.title}</h3>
    </div>
  );
}

export default VideoCard;
