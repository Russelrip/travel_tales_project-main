"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "@/components/auth-provider"
import { useAuthCheck } from "@/hooks/use-auth-check"

type LikeDislikeButtonsProps = {
  postId: number
  likes: number
  dislikes: number
}

export function LikeDislikeButtons({
  postId,
  likes: initialLikes,
  dislikes: initialDislikes,
}: LikeDislikeButtonsProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [dislikes, setDislikes] = useState(initialDislikes)
  const [userLiked, setUserLiked] = useState(false)
  const [userDisliked, setUserDisliked] = useState(false)
  const { toast } = useToast()
  const { session } = useSession()
  const { checkAuth, AuthModalComponent } = useAuthCheck()

  const handleLike = async () => {
    if (!checkAuth("like posts")) {
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to like post")
      }

      if (userLiked) {
        // User is unliking
        setLikes(likes - 1)
        setUserLiked(false)
      } else {
        // User is liking
        setLikes(likes + 1)
        setUserLiked(true)

        // If user previously disliked, remove the dislike
        if (userDisliked) {
          setDislikes(dislikes - 1)
          setUserDisliked(false)
        }
      }
    } catch (error) {
      console.warn("Error liking post:", error)

      // For preview, update the UI anyway
      if (userLiked) {
        // User is unliking
        setLikes(likes - 1)
        setUserLiked(false)
      } else {
        // User is liking
        setLikes(likes + 1)
        setUserLiked(true)

        // If user previously disliked, remove the dislike
        if (userDisliked) {
          setDislikes(dislikes - 1)
          setUserDisliked(false)
        }
      }
    }
  }

  const handleDislike = async () => {
    if (!checkAuth("dislike posts")) {
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}/dislike`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to dislike post")
      }

      if (userDisliked) {
        // User is removing dislike
        setDislikes(dislikes - 1)
        setUserDisliked(false)
      } else {
        // User is disliking
        setDislikes(dislikes + 1)
        setUserDisliked(true)

        // If user previously liked, remove the like
        if (userLiked) {
          setLikes(likes - 1)
          setUserLiked(false)
        }
      }
    } catch (error) {
      console.warn("Error disliking post:", error)

      // For preview, update the UI anyway
      if (userDisliked) {
        // User is removing dislike
        setDislikes(dislikes - 1)
        setUserDisliked(false)
      } else {
        // User is disliking
        setDislikes(dislikes + 1)
        setUserDisliked(true)

        // If user previously liked, remove the like
        if (userLiked) {
          setLikes(likes - 1)
          setUserLiked(false)
        }
      }
    }
  }

  return (
    <>
      {AuthModalComponent}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 px-2 ${userLiked ? "text-green-500" : ""}`}
          onClick={handleLike}
        >
          <ThumbsUp className="h-4 w-4" />
          <span>{likes}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 px-2 ${userDisliked ? "text-red-500" : ""}`}
          onClick={handleDislike}
        >
          <ThumbsDown className="h-4 w-4" />
          <span>{dislikes}</span>
        </Button>
      </div>
    </>
  )
}
