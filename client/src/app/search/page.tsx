"use client";

import { CardFooter } from "@/components/ui/card";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/pagination";
import { UserAvatar } from "@/components/user-avatar";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "@/components/auth-provider";
import { Search } from "lucide-react";
import { LikeButton } from "@/components/like-button";
import { searchPostsByAuthor, searchPostsByCountry } from "@/services/blogService";
import { BlogPostWithDetailsDTO } from "@/types/blog";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { session } = useSession();

  const initialQuery = searchParams.get("q") || "";
  const initialType = searchParams.get("type") || "country";
  const initialPage = Number.parseInt(searchParams.get("page") || "1");

  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState(initialType);
  const [results, setResults] = useState<{ posts: BlogPostWithDetailsDTO[]; pagination: any }>({
    posts: [],
    pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const performSearch = async (q: string, type: string, page: number) => {
    if (!q) return;

    setIsLoading(true);
    try {
      let data: BlogPostWithDetailsDTO[] = [];
      if (type === "country") data = await searchPostsByCountry(q, page, 10);
      else if (type === "user") data = await searchPostsByAuthor(q, page, 10);

      setResults({
        posts: data,
        pagination: {
          total: data.length,
          page,
          limit: 10,
          totalPages: Math.ceil(data.length / 10) || 1,
        },
      });
    } catch (error) {
      console.warn("Search error:", error);
      // const mockPosts = getMockPosts(9);
      // setResults({
      //   posts: mockPosts,
      //   pagination: {
      //     total: mockPosts.length,
      //     page,
      //     limit: 10,
      //     totalPages: Math.ceil(mockPosts.length / 10) || 1,
      //   },
      // });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) performSearch(initialQuery, initialType, initialPage);
  }, [initialQuery, initialType, initialPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    router.push(`/search?q=${encodeURIComponent(query)}&type=${searchType}&page=1`);
    performSearch(query, searchType, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`/search?q=${encodeURIComponent(query)}&type=${searchType}&page=${page}`);
    performSearch(query, searchType, page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Travel Posts</CardTitle>
          <CardDescription>Find posts by country or username</CardDescription>
        </CardHeader>
        <form onSubmit={handleSearch}>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search..." className="pl-8" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <Button type="submit" disabled={isLoading || !query}>
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
            <RadioGroup defaultValue={searchType} className="flex space-x-4" onValueChange={setSearchType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="country" id="country" />
                <Label htmlFor="country">Search by Country</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="user" id="user" />
                <Label htmlFor="user">Search by Username</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </form>
      </Card>

      {query && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">
            {results.posts.length > 0 ? `Search results for "${query}"` : `No results found for "${query}"`}
          </h2>

          {results.posts.length > 0 && (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
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
                ))}
              </div>

              {results.pagination.totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={results.pagination.totalPages} onPageChange={handlePageChange} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}



