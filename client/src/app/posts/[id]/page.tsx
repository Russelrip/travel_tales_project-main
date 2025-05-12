// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { formatDate } from "@/lib/utils"
// import { useSession } from "@/components/auth-provider"
// import { UserAvatar } from "@/components/user-avatar"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { LikeButton } from "@/components/like-button"
// import { CommentSection } from "@/components/comment-section"
// import { FollowButton } from "@/components/follow-button"
// import { Card, CardHeader, CardTitle } from "@/components/ui/card"
// import { useToast } from "@/components/ui/use-toast"
// import { useAuthCheck } from "@/hooks/use-auth-check"

// export default function PostPage() {
//   const params = useParams()
//   const router = useRouter()
//   const postId = params?.id as string
//   const { session } = useSession()
//   const { checkAuth, AuthModalComponent } = useAuthCheck()
//   const [post, setPost] = useState<any>(null)
//   const [comments, setComments] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const { toast } = useToast()

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         // Try to fetch the post from the API
//         const postResponse = await fetch(`/api/posts/${postId}`)

//         if (!postResponse.ok) {
//           throw new Error("Failed to fetch post")
//         }

//         const postData = await postResponse.json()
//         setPost(postData.post)

//         // Try to fetch comments
//         try {
//           const commentsResponse = await fetch(`/api/posts/${postId}/comments`)
//           if (commentsResponse.ok) {
//             const commentsData = await commentsResponse.json()
//             setComments(commentsData.comments || [])
//           } else {
//             throw new Error("Failed to fetch comments")
//           }
//         } catch (commentError) {
//           console.warn("Error fetching comments:", commentError)
//           // Use mock comments as fallback
//           setComments(getMockComments())
//         }
//       } catch (error) {
//         console.warn("Error fetching post:", error)
//         // Use mock data as fallback
//         const mockPosts = getMockPosts(10)
//         const mockPost = mockPosts.find((p) => p.id === Number(postId)) || mockPosts[0]
//         setPost(mockPost)
//         setComments(getMockComments())
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (postId) {
//       fetchPost()
//     }
//   }, [postId, toast])

//   if (loading) {
//     return (
//       <div className="container max-w-4xl py-10">
//         <Card>
//           <CardHeader>
//             <CardTitle>Loading...</CardTitle>
//           </CardHeader>
//         </Card>
//       </div>
//     )
//   }

//   if (!post) {
//     return (
//       <div className="container max-w-4xl py-10">
//         <Card>
//           <CardHeader>
//             <CardTitle>Post not found</CardTitle>
//           </CardHeader>
//         </Card>
//       </div>
//     )
//   }

//   // Check if the current user is the author of the post
//   const isAuthor = session && session.user.id === post.author.id

//   const handleFollowClick = () => {
//     if (!session) {
//       checkAuth("follow users")
//       return
//     }
//   }

//   return (
//     <div className="container max-w-4xl py-10">
//       {AuthModalComponent}
//       <article className="space-y-8">
//         <div className="space-y-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <UserAvatar user={post.author} className="h-16 w-16" />
//               <div>
//                 <div className="flex items-center gap-2">
//                   <Link href={`/users/${post.author.username}`} className="font-medium hover:underline">
//                     {post.author.username}
//                   </Link>
//                   {session && session.user.id !== post.author.id && (
//                     <div onClick={handleFollowClick}>
//                       <FollowButton username={post.author.username} />
//                     </div>
//                   )}
//                 </div>
//                 <p className="text-sm text-muted-foreground">{formatDate(post.createdAt)}</p>
//               </div>
//             </div>
//             {isAuthor && (
//               <div className="flex gap-2">
//                 <Button variant="outline" size="sm" asChild>
//                   <Link href={`/posts/${post.id}/edit`}>Edit</Link>
//                 </Button>
//                 <Button variant="destructive" size="sm" asChild>
//                   <Link href={`/posts/${post.id}/delete`}>Delete</Link>
//                 </Button>
//               </div>
//             )}
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{post.title}</h1>
//             <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
//               <div className="flex items-center gap-1">
//                 <span className="font-medium">Country:</span> {post.country}
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="font-medium">Visited:</span> {formatDate(post.visitDate)}
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="prose prose-gray max-w-none dark:prose-invert">
//           {post.content.split("\n").map((paragraph: string, i: number) => (
//             <p key={i}>{paragraph}</p>
//           ))}
//         </div>
//         <div className="flex items-center justify-between border-t border-b py-4">
//           <LikeButton postId={post.id} likes={post.likes} didUserLikeThis={post.didUserLikeThis} />
//           <div className="text-sm text-muted-foreground">{comments.length} comments</div>
//         </div>
//         <CommentSection postId={post.id} initialComments={comments} session={session} />
//       </article>
//     </div>
//   )
// }


"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { useSession } from "@/components/auth-provider";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LikeButton } from "@/components/like-button";
import { CommentSection } from "@/components/comment-section";
import { FollowButton } from "@/components/follow-button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuthCheck } from "@/hooks/use-auth-check";
import { getBlogPostById } from "@/services/blogService";
import type { BlogPostWithDetailsDTO } from "@/types/blog";

export default function PostPage() {
  const params = useParams();
  const postId = params?.id as string;
  const { session } = useSession();
  const { checkAuth, AuthModalComponent } = useAuthCheck();
  const { toast } = useToast();
  const router = useRouter();

  const [post, setPost] = useState<BlogPostWithDetailsDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      try {
        const postData = await getBlogPostById(Number(postId));
        setPost(postData);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load post",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, toast]);

  if (loading) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Post not found</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const isAuthor = session?.user?.username === post.authorUsername;

  return (
    <div className="container max-w-4xl py-10">
      {AuthModalComponent}
      <article className="space-y-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <UserAvatar user={{ username: post.authorUsername }} className="h-16 w-16" />
              <div>
                <div className="flex items-center gap-2">
                  <Link href={`/users/${post.authorUsername}`} className="font-medium hover:underline">
                    {post.authorUsername}
                  </Link>
                  {!isAuthor && session && (
                    <FollowButton username={post.authorUsername} initialIsFollowing={post.isUserFollowingAuthor} />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{formatDate(post.dateBlogWasCreated)}</p>
              </div>
            </div>
            {isAuthor && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/posts/${post.id}/edit`}>Edit</Link>
                </Button>
                <Button variant="destructive" size="sm" asChild>
                  <Link href={`/posts/${post.id}/delete`}>Delete</Link>
                </Button>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{post.title}</h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="font-medium">Country:</span> {post.countryName}
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Visited:</span> {formatDate(post.dateOfVisit)}
              </div>
            </div>
          </div>
        </div>
        <div className="prose prose-gray max-w-none dark:prose-invert">
          {post.content.split("\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-b py-4">
          <LikeButton postId={post.id} likes={post.likeCount} didUserLikeThis={post.didUserLikeThis} />
          <div className="text-sm text-muted-foreground">{post.listOfComments.length} comments</div>
        </div>
        <CommentSection postId={post.id} initialComments={post.listOfComments} session={session} />
      </article>
    </div>
  );
}

