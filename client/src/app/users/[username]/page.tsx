"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { FollowButton } from "@/components/follow-button";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "@/components/auth-provider";
import { LikeButton } from "@/components/like-button";
import { useToast } from "@/components/ui/use-toast";
import { getUserByUsername, getUserProfile } from "@/services/userService";
import type { BlogPostWithDetailsDTO } from "@/types/blog";
import { UserBasicDTO, UserProfileResponse } from "@/types/user";

export default function UserProfilePage() {
  const params = useParams();
  const username = params?.username as string;
  const { session } = useSession();
  const { toast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ followers: 0, following: 0, posts: 0 });
  const [posts, setPosts] = useState<BlogPostWithDetailsDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;

      try {
        const user: UserBasicDTO = await getUserByUsername(username);

        const profileResponse: UserProfileResponse = await getUserProfile(user.id);

        setUser({ id: user.id, username: profileResponse.data.username, email: profileResponse.data.email, dateOfJoining: profileResponse.data.dateOfJoining, isUserFollowing: profileResponse.data.isUserFollowing });

        setStats({
          posts: profileResponse.data.totalPosts,
          followers: profileResponse.data.followerCount,
          following: profileResponse.data.followingCount
        });

        setPosts(profileResponse.data.posts);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username, toast]);

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 animate-pulse rounded-full bg-muted"></div>
          <div className="space-y-2">
            <div className="h-6 w-32 animate-pulse rounded-md bg-muted"></div>
            <div className="h-4 w-48 animate-pulse rounded-md bg-muted"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>User not found</CardTitle>
            <CardDescription>The user you are looking for does not exist.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const isCurrentUser = session?.user?.id === user.id;

  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <UserAvatar user={{ username: user.username }} className="h-24 w-24 text-4xl" />
          <div className="flex flex-1 flex-col items-center space-y-4 text-center sm:items-start sm:text-left">
            <div>
              <h1 className="text-3xl font-bold">{user.username}</h1>
              <p className="text-muted-foreground">Member since {formatDate(user.dateOfJoining)}</p>
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-2xl font-bold">{stats.posts}</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.followers}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.following}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </div>
            {!isCurrentUser && session && <FollowButton username={username} initialIsFollowing={user.isUserFollowing} />}
          </div>
        </div>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-6">
          {posts.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No posts yet</CardTitle>
                <CardDescription>
                  {isCurrentUser
                    ? "You haven't created any posts yet. Share your travel experiences!"
                    : `${username} hasn't created any posts yet.`}
                </CardDescription>
              </CardHeader>
              {isCurrentUser && (
                <CardContent>
                  <Button asChild>
                    <Link href="/posts/new">Create Your First Post</Link>
                  </Button>
                </CardContent>
              )}
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="line-clamp-2">
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
                  <div className="flex items-center justify-between border-t p-3">
                    <LikeButton postId={post.id} likes={post.likeCount ?? 0} didUserLikeThis={post.didUserLikeThis} />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Link href={`/posts/${post.id}#comments`} className="hover:underline">
                        {post.listOfComments?.length ?? 0} comments
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}



