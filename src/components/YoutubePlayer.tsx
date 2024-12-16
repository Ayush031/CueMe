import { Video } from "@/app/lib/types";
import React, { useEffect, useRef, useState } from "react";
const YouTubePlayer = ({
  currentVideo,
  // @ts-expect-error ignore
  playVideo,
  // @ts-expect-error ignore
  onVideoEnd,
}: {
  currentVideo: Video;
}) => {
  const playerRef = useRef(null);
  const [isAPIReady, setIsAPIReady] = useState(false);
  
  useEffect(() => {
    // Only load the API once
    // @ts-expect-error ignore
    if (window.YT) {
      setIsAPIReady(true);
      return;
    }
    
    // Create a global callback
    // @ts-expect-error ignore
    window.onYouTubeIframeAPIReady = () => {
      setIsAPIReady(true);
    };
    
    // Load the IFrame Player API code asynchronously
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    // @ts-expect-error ignore
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    return () => {
      // @ts-expect-error ignore
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  useEffect(() => {
    if (!isAPIReady || !currentVideo?.extractedId || !playVideo) return;

    // Initialize player
    // @ts-expect-error ignore
    playerRef.current = new window.YT.Player("youtube-player", {
      height: "100%",
      width: "100%",
      videoId: currentVideo.extractedId,
      playerVars: {
        autoplay: 1,
        mute: 1,
        enablejsapi: 1,
      },
      events: {
        // @ts-expect-error ignore
        onStateChange: (event) => {
          // YT.PlayerState.ENDED = 0
          if (event.data === 0) {
            console.log("Video ended, playing next");
            onVideoEnd?.();
          }
        },
        // @ts-expect-error ignore
        onError: (error) => {
          console.error("YouTube Player Error:", error);
          // If there's an error, try to play next video
          onVideoEnd?.();
        },
      },
    });

    return () => {
      if (playerRef.current) {
        // @ts-expect-error ignore
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [isAPIReady, currentVideo?.extractedId, playVideo]);

  if (!currentVideo) {
    return (
      <div className="min-h-10 bg-gray-100 flex items-center justify-center rounded">
        <p className="text-gray-500">No video playing</p>
      </div>
    );
  }

  return (
    <div className="aspect-video">
      {playVideo ? (
        <div
          id="youtube-player"
          className="w-full h-full"
          style={{ aspectRatio: "16/9" }}
        />
      ) : (
        <>
          <img
            src={currentVideo.bigImg}
            alt="thumbnail"
            className="w-full h-full object-cover"
          />
          <h2>{currentVideo.title}</h2>
        </>
      )}
    </div>
  );
};

export default YouTubePlayer;
