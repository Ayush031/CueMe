"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { ShareButton } from "@/components/ShareButton";
import { Play, ChevronUpCircle, ChevronDownCircle } from "lucide-react";

interface Video {
  id: string;
  title: string;
  upvotes: number;
  smlImg: string;
  bigImg: string;
  hasUpvoted: boolean;
}

const REFRESH_INTERVAL_MS = 3000;

export default function StreamView({ creatorId }: { creatorId: string }) {
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [videoQueue, setVideoQueue] = useState<Video[]>([]);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [previewVideoId, setPreviewVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const extractVideoId = (url: string) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setNewVideoUrl(url);
    const videoId = extractVideoId(url);
    setPreviewVideoId(videoId);
  };

  const handleSubmit = async () => {
    const videoId = extractVideoId(newVideoUrl);
    if (!videoId) return;

    setIsLoading(true);
    try {
      // const response = await fetch(
      //   `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
      // );

      // if (!data.title) {
      //   throw new Error("Invalid video URL");
      // }

      // const newVideo: Video = {
      //   id: videoId,
      //   title: data.title,
      //   upvotes: 0,
      //   smlImg: data.thumbnail_url || `/api/placeholder/120/90`,
      //   bigImg: data.thumbnail_url || `/api/placeholder/480/360`,
      //   hasUpvoted: false,
      // };

      // setVideoQueue((prev) => [...prev, newVideo]);

      await axios
        .post("/api/streams/", {
          creatorId,
          url: newVideoUrl,
        })
        .then((res) => {
          const data = res.data;
          toast({
            title: data?.message?.title,
            description: data?.message?.description,
          });
        });
      setNewVideoUrl("");
      setPreviewVideoId(null);
    } catch (error) {
      console.error("Error fetching video info:", error);
      toast({
        title: "Ahh! Error",
        description: "Check your network & try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (video: Video, index: number) => {
    try {
      const newQueue = [...videoQueue];
      const increment = video.hasUpvoted ? -1 : 1;

      newQueue[index] = {
        ...video,
        upvotes: video.upvotes + increment,
        hasUpvoted: !video.hasUpvoted,
      };
      newQueue.sort((a, b) => b.upvotes - a.upvotes);
      setVideoQueue(newQueue);
      const res = await axios.post(
        `/api/streams/${video.hasUpvoted ? "downvote" : "upvote"}`,
        {
          streamId: video.id,
        }
      );
      toast({
        title: res.data.message
          ? "Successfully Upvoted !!"
          : "Successfully Downvoted !!",
      });
    } catch (error) {
      console.error("Error voting:", error);
      refreshStreams();
    }
  };

  const playNext = () => {
    if (videoQueue.length > 0) {
      setCurrentVideo(videoQueue[0].id);
      setVideoQueue((prev) => prev.slice(1));
    }
  };

  const refreshStreams = async () => {
    try {
      const res = await axios.get(`/api/streams/?creatorId=${creatorId}`);
      const userStreams = res?.data?.streams;
      if (Array.isArray(userStreams)) {
        setVideoQueue(userStreams.sort((a, b) => b.upvotes - a.upvotes));
      }
    } catch (error) {
      console.error("Error refreshing streams:", error);
    }
  };

  useEffect(() => {
    refreshStreams();
    const intervalId = setInterval(refreshStreams, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Song Voting Queue</h1>
        <ShareButton creatorId={creatorId} />
      </div>

      <div className="flex justify-between gap-x-20 mb-8">
        {/* Current Video Player */}
        <div className="basis-1/2">
          <h2 className="text-xl font-semibold mb-2">Now Playing</h2>
          {currentVideo ? (
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentVideo}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="min-h-10 bg-gray-100 flex items-center justify-center rounded">
              <p className="text-gray-500">No video playing</p>
            </div>
          )}
        </div>

        {/* Video Submission */}
        <div className="basis-1/2 h-full">
          <h2 className="text-xl font-semibold mb-2">Submit a Song</h2>
          <div className="flex gap-2 mb-2">
            <Input
              type="text"
              placeholder="Enter YouTube URL"
              value={newVideoUrl}
              onChange={handleUrlChange}
              disabled={isLoading}
            />
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !previewVideoId}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
          {previewVideoId && (
            <div className="aspect-video max-w-sm">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${previewVideoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>

      {/* Video Queue */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-xl mb-1 font-semibold">Upcoming Songs</h2>
          {videoQueue.length > 0 && (
            <Button className="mt4" onClick={playNext}>
              <Play className="h-4 w-4 mr-2" />
              Play Next
            </Button>
          )}
        </div>
        {videoQueue.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No songs in queue</p>
        ) : (
          <ul className="space-y-2">
            {videoQueue.map((video, index) => (
              <li
                key={video.id}
                className="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={video.smlImg}
                    alt={video.title}
                    width={90}
                    height={68}
                    className="rounded"
                  />
                  <span className="font-medium">{video.title}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleVote(video, index)}
                  className="flex items-center gap-1.5"
                >
                  <span>{video.upvotes}</span>
                  {!video.hasUpvoted ? (
                    <ChevronUpCircle className="h-4 w-4" />
                  ) : (
                    <ChevronDownCircle className="h-4 w-4" />
                  )}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Toaster />
    </div>
  );
}
