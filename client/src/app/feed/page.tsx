"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useSession } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { LikeButton } from "@/components/like-button";
import { Pagination } from "@/components/pagination";
import { getFollowingFeed } from "@/services/blogService";
import { BlogPostWithDetailsDTO } from "@/types/blog";

export default function FeedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { session } = useSession();
  const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1;

  const [posts, setPosts] = useState<BlogPostWithDetailsDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    if (!session) {
      setRedirectToLogin(true);
    }
  }, [session]);

  useEffect(() => {
    if (redirectToLogin) router.push("/login");
  }, [redirectToLogin, router]);

  useEffect(() => {
    const fetchFeed = async () => {
      if (!session) return;

      try {
        const data = await getFollowingFeed(page, 10, false);
        setPosts(data);
      } catch (error) {
        console.warn("Error fetching feed:", error);
        setPosts([]);   // no mock
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchFeed();
    else setLoading(false);
  }, [page, session]);

  const handlePageChange = (newPage: number) => {
    router.push(`/feed?page=${newPage}`);
  };

  if (redirectToLogin) return null;

  return (
    <div className="container py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Following Feed</h1>
        <p className="text-muted-foreground">Posts from users you follow</p>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : posts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No posts found</CardTitle>
            <CardDescription>Follow users to see posts in your feed</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/search?type=user">Find Users to Follow</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
          {posts.length >= 10 && (
            <div className="mt-8">
              <Pagination currentPage={page} totalPages={Math.ceil(posts.length / 10)} onPageChange={handlePageChange} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function BlogPostCard({ post }: { post: BlogPostWithDetailsDTO }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <UserAvatar user={{ username: post.authorUsername }} />
          <div>
            <Link href={`/users/${post.authorUsername}`} className="font-medium hover:underline">
              {post.authorUsername}
            </Link>
            <p className="text-xs text-muted-foreground">{formatDate(post.dateBlogWasCreated)}</p>
          </div>
        </div>
        <CardTitle className="mt-2 line-clamp-2">
          <Link href={`/posts/${post.id}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <span className="font-medium">Country:</span> {post.countryName}
          <span className="ml-2 font-medium">Visited:</span> {formatDate(post.dateOfVisit)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">{post.content}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-3">
        <LikeButton postId={post.id} likes={post.likeCount ?? 0} didUserLikeThis={post.didUserLikeThis} />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href={`/posts/${post.id}#comments`} className="hover:underline">
            {post.listOfComments.length} comments
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="h-6 w-24 animate-pulse rounded-md bg-muted"></div>
            <div className="h-8 w-full animate-pulse rounded-md bg-muted"></div>
          </CardHeader>
          <CardContent>
            <div className="h-20 w-full animate-pulse rounded-md bg-muted"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


// function BlogPostCard({ post, session }: { post: any; session: any }) {
//   return (
//     <Card className="overflow-hidden">
//       <CardHeader className="pb-3">
//         <div className="flex items-center gap-3">
//           <UserAvatar user={post.author} />
//           <div>
//             <Link href={`/users/${post.author.username}`} className="font-medium hover:underline">
//               {post.author.username}
//             </Link>
//             <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
//           </div>
//         </div>
//         <CardTitle className="mt-2 line-clamp-2">
//           <Link href={`/posts/${post.id}`} className="hover:underline">
//             {post.title}
//           </Link>
//         </CardTitle>
//         <CardDescription className="flex items-center gap-1">
//           <span className="font-medium">Country:</span> {post.country}
//           <span className="ml-2 font-medium">Visited:</span> {formatDate(post.visitDate)}
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <p className="line-clamp-3 text-sm text-muted-foreground">{post.content}</p>
//       </CardContent>
//       <CardFooter className="flex items-center justify-between border-t p-3">
//         <LikeButton postId={post.id} likes={post.likes} />
//         <div className="flex items-center gap-2 text-sm text-muted-foreground">
//           <Link href={`/posts/${post.id}#comments`} className="hover:underline">
//             {post.commentCount} comments
//           </Link>
//         </div>
//       </CardFooter>
//     </Card>
//   )
// }