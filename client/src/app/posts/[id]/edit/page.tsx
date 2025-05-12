"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/components/auth-provider";
import { format } from "date-fns";
import { getBlogPostById, updateBlogPost } from "@/services/blogService";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = Number(params?.id);
  const { session } = useSession();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [countryName, setCountryName] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push(`/login?redirect=/posts/${postId}/edit`);
    }
  }, [session, postId, router]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId || !session) return;

      try {
        const post = await getBlogPostById(postId);

        if (post.authorUsername !== session.user.username) {
          toast({
            title: "Unauthorized",
            description: "You can only edit your own posts.",
            variant: "destructive",
          });
          router.push(`/posts/${postId}`);
          return;
        }

        setTitle(post.title);
        setContent(post.content);
        setCountryName(post.countryName);
        setVisitDate(format(new Date(post.dateOfVisit), "yyyy-MM-dd"));
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load post.",
          variant: "destructive",
        });
        router.push("/");
      } finally {
        setIsFetching(false);
      }
    };

    fetchPost();
  }, [postId, session, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateBlogPost(postId, {
        title,
        content,
        countryName,
        dateOfVisit: visitDate ? new Date(visitDate).toISOString() : null,   //  only change
      });
      toast({ title: "Success", description: "Post updated!" });
      router.push(`/posts/${postId}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Update failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="container max-w-3xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Travel Post</CardTitle>
          <CardDescription>Update your travel experience</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="country">Country Name</Label>
              <Input id="country" value={countryName} onChange={(e) => setCountryName(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="visitDate">Date of Visit</Label>
              <Input
                id="visitDate"
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="min-h-[200px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push(`/posts/${postId}`)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

