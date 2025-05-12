"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { CommentDTO } from "@/types/comment";

type CommentSectionProps = {
  postId: number;
  initialComments: CommentDTO[];
  session: any;
};

export function CommentSection({ postId, initialComments, session }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentDTO[]>(initialComments || []);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment",
        variant: "destructive"
      });
      router.push("/login");
      return;
    }

    if (!newComment.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({
          blogPostId: postId,
          comment: newComment
        })
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const { data } = await response.json();
      setComments([{
        id: data.id,
        username: session.user.username,
        dateWritten: data.createdAt,
        commentContent: data.comment,
        isUserOwned: true
      }, ...comments]);
      setNewComment("");

      toast({
        title: "Comment added",
        description: "Your comment has been added successfully"
      });
    } catch (error: any) {
      console.warn("Error adding comment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      setComments(comments.filter((comment) => comment.id !== commentId));

      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully"
      });
    } catch (error: any) {
      console.warn("Error deleting comment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete comment",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6" id="comments">
      <h2 className="text-2xl font-bold">Comments</h2>

      {session && (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </form>
      )}

      {!session && (
        <div className="rounded-md bg-muted p-4 text-center">
          <p className="mb-2">Please log in to comment</p>
          <Button asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-2 rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserAvatar user={{ username: comment.username }} />
                  <div>
                    <Link href={`/users/${comment.username}`} className="font-medium hover:underline">
                      {comment.username}
                    </Link>
                    <p className="text-xs text-muted-foreground">{formatDate(comment.dateWritten)}</p>
                  </div>
                </div>
                {comment.isUserOwned && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteComment(comment.id)}
                    className="h-8 w-8 p-0 text-muted-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete comment</span>
                  </Button>
                )}
              </div>
              <p className="text-sm">{comment.commentContent}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
