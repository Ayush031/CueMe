"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ShareButton({ creatorId }: { creatorId: string }) {
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();
  const handleShare = async () => {
    setIsSharing(true);
    const shareableLink = `${window.location.host}/creator/${creatorId}`;
    try {
      navigator.clipboard.writeText(shareableLink).then(() => {
        toast({
          title: "Link Copied to clipboard !!",
          description: shareableLink,
        });
      });
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
