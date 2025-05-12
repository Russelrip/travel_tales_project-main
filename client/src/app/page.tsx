// "use client"

// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { formatDate } from "@/lib/utils"
// import Link from "next/link"
// import { UserAvatar } from "@/components/user-avatar"
// import { useSession } from "@/components/auth-provider"
// import { getMockPosts } from "@/lib/mock-data"
// import { LikeButton } from "@/components/like-button"

// export default function Home() {
//   const { session } = useSession()
//   const [recentPosts, setRecentPosts] = useState([])
//   const [popularPosts, setPopularPosts] = useState([])
//   const [mostCommentedPosts, setMostCommentedPosts] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     // Function to fetch posts with error handling and fallback to mock data
//     const fetchPosts = async (endpoint, setter) => {
//       try {
//         const response = await fetch(endpoint)
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`)
//         }
//         const data = await response.json()
//         setter(data.posts || [])
//       } catch (error) {
//         console.warn(`Error fetching from ${endpoint}:`, error)
//         // Use mock data as fallback
//         const mockPosts = getMockPosts(6)
//         setter(mockPosts)
//       }
//     }

//     // Fetch recent posts
//     fetchPosts("/api/posts?sort=recent", setRecentPosts).finally(() => setLoading(false))

//     // Fetch popular posts
//     fetchPosts("/api/posts?sort=popular", setPopularPosts)

//     // Fetch most commented posts
//     fetchPosts("/api/posts?sort=commented", setMostCommentedPosts)
//   }, [])

//   return (
//     <div className="container py-8">
//       <section className="mb-12 space-y-4 text-center">
//         <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">TravelTales</h1>
//         <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
//           Share your travel experiences and discover amazing destinations around the world.
//         </p>
//         {!session && (
//           <div className="flex justify-center gap-4 mt-6">
//             <Link
//               href="/register"
//               className="inline-block bg-white text-black border border-gray-300 hover:bg-gray-100 px-6 py-2 rounded-md font-medium"
//             >
//               Get Started
//             </Link>
//             <Link
//               href="/login"
//               className="inline-block bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-md font-medium"
//             >
//               Sign In
//             </Link>
//           </div>
//         )}
//         {session && (
//           <div className="mt-10">
//             <Button
//               asChild
//               className="text-xl px-10 py-7 font-bold shadow-lg rounded-lg transition-all duration-200 transform hover:scale-105"
//             >
//               <Link href="/posts/new">Share Your Journey</Link>
//             </Button>
//           </div>
//         )}
//       </section>

//       <Tabs defaultValue="recent" className="w-full">
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="recent">Recent Posts</TabsTrigger>
//           <TabsTrigger value="popular">Most Liked</TabsTrigger>
//           <TabsTrigger value="commented">Most Commented</TabsTrigger>
//         </TabsList>
//         <TabsContent value="recent" className="mt-6">
//           {loading ? (
//             <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//               {[1, 2, 3].map((i) => (
//                 <Card key={i} className="overflow-hidden">
//                   <CardHeader className="pb-3">
//                     <div className="h-6 w-24 animate-pulse rounded-md bg-muted"></div>
//                     <div className="h-8 w-full animate-pulse rounded-md bg-muted"></div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="h-20 w-full animate-pulse rounded-md bg-muted"></div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           ) : (
//             <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//               {recentPosts.map((post: any) => (
//                 <BlogPostCard key={post.id} post={post} session={session} />
//               ))}
//             </div>
//           )}
//         </TabsContent>
//         <TabsContent value="popular" className="mt-6">
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {popularPosts.map((post: any) => (
//               <BlogPostCard key={post.id} post={post} session={session} />
//             ))}
//           </div>
//         </TabsContent>
//         <TabsContent value="commented" className="mt-6">
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {mostCommentedPosts.map((post: any) => (
//               <BlogPostCard key={post.id} post={post} session={session} />
//             ))}
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

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

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { UserAvatar } from "@/components/user-avatar";
import { useSession } from "@/components/auth-provider";
import { LikeButton } from "@/components/like-button";
import { getRecentPosts, getMostLikedPosts, getMostCommentedPosts } from "@/services/blogService";
import { BlogPostWithDetailsDTO } from "@/types/blog";

export default function Home() {
  const { session } = useSession();
  const [recentPosts, setRecentPosts] = useState<BlogPostWithDetailsDTO[]>([]);
  const [popularPosts, setPopularPosts] = useState<BlogPostWithDetailsDTO[]>([]);
  const [mostCommentedPosts, setMostCommentedPosts] = useState<BlogPostWithDetailsDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const recent = await getRecentPosts(10);
        setRecentPosts(recent);

        const popular = await getMostLikedPosts(10);
        setPopularPosts(popular);

        const commented = await getMostCommentedPosts(10);
        setMostCommentedPosts(commented);
      } catch (error) {
        console.warn("Error fetching posts:", error);
        // const mockPosts = getMockPosts(6);
        // setRecentPosts(mockPosts);
        // setPopularPosts(mockPosts);
        // setMostCommentedPosts(mockPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container py-8">
      <section className="mb-12 space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">TravelTales</h1>
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
          Share your travel experiences and discover amazing destinations around the world.
        </p>
        {!session && (
          <div className="flex justify-center gap-4 mt-6">
            <Link href="/register" className="inline-block bg-white text-black border border-gray-300 hover:bg-gray-100 px-6 py-2 rounded-md font-medium">
              Get Started
            </Link>
            <Link href="/login" className="inline-block bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-md font-medium">
              Sign In
            </Link>
          </div>
        )}
        {session && (
          <div className="mt-10">
            <Button asChild className="text-xl px-10 py-7 font-bold shadow-lg rounded-lg transition-all duration-200 transform hover:scale-105">
              <Link href="/posts/new">Share Your Journey</Link>
            </Button>
          </div>
        )}
      </section>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">Recent Posts</TabsTrigger>
          <TabsTrigger value="popular">Most Liked</TabsTrigger>
          <TabsTrigger value="commented">Most Commented</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="mt-6">
          {loading ? <LoadingCards /> : <PostGrid posts={recentPosts} session={session} />}
        </TabsContent>
        <TabsContent value="popular" className="mt-6">
          <PostGrid posts={popularPosts} session={session} />
        </TabsContent>
        <TabsContent value="commented" className="mt-6">
          <PostGrid posts={mostCommentedPosts} session={session} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PostGrid({ posts, session }: { posts: BlogPostWithDetailsDTO[]; session: any }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogPostCard key={post.id}
          post={post} session={session} />
      ))}
    </div>
  );
}

function LoadingCards() {
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

function BlogPostCard({ post, session }: { post: BlogPostWithDetailsDTO; session: any }) {
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
            {post.listOfComments?.length ?? 0} comments
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

