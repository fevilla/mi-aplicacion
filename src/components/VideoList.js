import React from "react";
import VideoCard from "./VideoCard";

function VideoList({ videos, query , detections})
{
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="video-list">
      {filteredVideos.map((video) => (
        <VideoCard key={video.id} video={video} detections={detections}/>
      ))}
    </div>
  );
}

export default VideoList;
