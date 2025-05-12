"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/components/auth-provider";
import { useAuthCheck } from "@/hooks/use-auth-check";
import { likePost, unlikePost } from "@/services/likeService";
import { useRouter } from "next/navigation";

type LikeButtonProps = {
  postId: number;
  likes: number;
  didUserLikeThis: boolean;
};

export function LikeButton({ postId, likes: initialLikes, didUserLikeThis }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [userLiked, setUserLiked] = useState(didUserLikeThis);
  const { toast } = useToast();
  const { session } = useSession();
  const { checkAuth, AuthModalComponent } = useAuthCheck();
  const router = useRouter();

  useEffect(() => {
    setUserLiked(didUserLikeThis);
  }, [didUserLikeThis]);

  const handleLike = async () => {
    if (!session) {
      checkAuth("like posts");
      return;
    }

    try {
      if (userLiked) {
        await unlikePost(postId);
        setLikes((prev) => prev - 1);
        setUserLiked(false);
        toast({
          title: "Success",
          description: "You unliked this post."
        });
      } else {
        await likePost(postId);
        setLikes((prev) => prev + 1);
        setUserLiked(true);
        toast({
          title: "Success",
          description: "You liked this post."
        });
      }

      //  Force parent re-fetch so didUserLikeThis updates correctly
      router.refresh();
    } catch (error: any) {
      console.warn("Like toggle failed:", error);
      toast({
        title: "Error",
        description: error.message || "Action failed",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      {AuthModalComponent}
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-1 px-2 ${userLiked ? "text-green-500" : ""}`}
        onClick={handleLike}
      >
        <ThumbsUp className="h-4 w-4" />
        <span>{likes}</span>
      </Button>
    </>
  );
}



