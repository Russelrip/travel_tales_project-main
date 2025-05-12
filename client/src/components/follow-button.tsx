"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/auth-provider";
import { UserPlus, UserMinus } from "lucide-react";
import { useAuthCheck } from "@/hooks/use-auth-check";
import { getUserByUsername } from "@/services/userService";
import { followUser, unfollowUser } from "@/services/followService";

type FollowButtonProps = {
  username: string;
  initialIsFollowing: boolean;
};

export function FollowButton({ username, initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const { session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const { checkAuth, AuthModalComponent } = useAuthCheck();

  useEffect(() => {
    console.log("isFollowing: ", isFollowing);

    if (!session) return;

    const checkFollowStatus = async () => {
      try {
        const user = await getUserByUsername(username);
        const followingId = user.id;

        // check if current user already follows
        // This is optional. If you don't have an endpoint for it, skip this block.
        // setIsFollowing(await checkIfFollowing(followingId));

        // TEMP: assume backend returns this value somewhere if you have it
        setIsFollowing(initialIsFollowing); // remove or replace with real check
      } catch (error) {
        console.warn("Check follow status failed:", error);
        setIsFollowing(false);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkFollowStatus();
  }, [session, username]);

  const handleFollowToggle = async () => {
    if (!session) {
      checkAuth("follow users");
      return;
    }

    setIsLoading(true);

    try {
      const user = await getUserByUsername(username);
      const followingId = user.id;

      if (isFollowing) {
        await unfollowUser(followingId);
        toast({
          title: "Success",
          description: `Unfollowed ${username}`,
        });
      } else {
        await followUser(followingId);
        toast({
          title: "Success",
          description: `Now following ${username}`,
        });
      }

      setIsFollowing(!isFollowing);
      router.refresh();
    } catch (error: any) {
      console.warn(`Follow toggle failed:`, error);
      toast({
        title: "Error",
        description: error.message || "Action failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingStatus) {
    return (
      <Button variant="outline" size="sm" disabled>
        Loading...
      </Button>
    );
  }

  return (
    <>
      {AuthModalComponent}
      <Button
        variant={isFollowing ? "outline" : "default"}
        size="sm"
        onClick={handleFollowToggle}
        disabled={isLoading}
        className="flex items-center gap-1"
      >
        {isFollowing ? (
          <>
            <UserMinus className="h-4 w-4" />
            <span>Unfollow</span>
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4" />
            <span>Follow</span>
          </>
        )}
      </Button>
    </>
  );
}

