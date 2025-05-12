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
import { getCountriesByName } from "@/services/countryService";
import { deleteBlogPost, getBlogPostById, updateBlogPost } from "@/services/blogService";
import type { CountryDTO } from "@/types/country";

export default function EditPostPage() {
  const params = useParams();
  const postId = Number(params?.id);
  const router = useRouter();
  const { toast } = useToast();
  const { session } = useSession();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [countryQuery, setCountryQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<CountryDTO | null>(null);
  const [countryResults, setCountryResults] = useState<CountryDTO[]>([]);
  const [visitDate, setVisitDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  //  auth check
  useEffect(() => {
    if (!session) {
      router.push("/login?redirect=/posts/" + postId + "/edit");
    }
  }, [session, router, postId]);

  //  fetch post
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
        setVisitDate(format(new Date(post.dateOfVisit), "yyyy-MM-dd"));
        setCountryQuery(post.countryName);
        setSelectedCountry({
          name: post.countryName,
          capital: "",
          currencyName: "",
          currencySymbol: "",
          flag: "",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load post",
          variant: "destructive",
        });
        router.push("/");
      }
    };

    fetchPost();
  }, [postId, session, toast, router]);

  //  country search debounce
  useEffect(() => {
    if (!countryQuery) {
      setCountryResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await getCountriesByName(countryQuery);
        setCountryResults(results);
      } catch {
        // silent fail
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [countryQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      await deleteBlogPost(postId);

      toast({ title: "Success", description: "Post deleted!" });
      router.push("/");  // redirect to home page
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Deletion failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Delete Travel Post</CardTitle>
          <CardDescription>Delete your travel experience</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required disabled />
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="Type to search..."
                value={countryQuery}
                onChange={(e) => {
                  setCountryQuery(e.target.value);
                  setSelectedCountry(null);
                }}
                disabled
              />
              {isSearching && <p className="text-xs mt-1">Searching...</p>}
              {!isSearching && countryResults.length > 0 && (
                <div className="mt-2 border max-h-40 overflow-y-auto rounded bg-background shadow">
                  {countryResults.map((country) => (
                    <div
                      key={country.name}
                      onClick={() => {
                        setSelectedCountry(country);
                        setCountryQuery(country.name);
                        setCountryResults([]);
                      }}
                      className="px-3 py-2 cursor-pointer hover:bg-accent"
                    >
                      <div className="flex items-center">
                        <img src={country.flag} alt={country.name} className="w-5 h-3 mr-2" />
                        {country.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="visitDate">Date of Visit</Label>
              <Input
                id="visitDate"
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                required
                disabled
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required disabled />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push(`/posts/${postId}`)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? "Updating..." : "Delete Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}



