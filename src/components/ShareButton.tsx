"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ShareButton() {
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();
  const handleShare = async () => {
    setIsSharing(true);
    const shareData = {
      title: "Vote for the Next Song!",
      text: "Join our stream and vote for the next song to be played!",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully!",
          description: "The link has been shared.",
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "The link has been copied to your clipboard.",
        });
      }
    } catch (err) {
      console.error("Error sharing:", err);
      toast({
        title: "Sharing failed",
        description: "There was an error while trying to share.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button onClick={handleShare} disabled={isSharing}>
      <Share2 className="h-4 w-4 mr-2" />
      {isSharing ? "Sharing..." : "Share"}
    </Button>
  );
}
