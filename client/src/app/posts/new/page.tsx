"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/components/auth-provider";
import { format } from "date-fns";
import { getCountriesByName } from "@/services/countryService";
import { createBlogPost } from "@/services/blogService";     //  use your API
import type { CountryDTO } from "@/types/country";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visitDate, setVisitDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const [countryQuery, setCountryQuery] = useState("");
  const [countryResults, setCountryResults] = useState<CountryDTO[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryDTO | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const { session } = useSession();
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    if (!session) setRedirectToLogin(true);
  }, [session]);

  useEffect(() => {
    if (redirectToLogin) router.push("/login?redirect=/posts/new");
  }, [redirectToLogin, router]);

  // Debounced search
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
      } catch (error) {
        console.warn("Country search failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [countryQuery]);

  const handleCountrySelect = (country: CountryDTO) => {
    setSelectedCountry(country);
    setCountryQuery(country.name);
    setCountryResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCountry) {
      toast({ title: "Error", description: "Please select a country", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const blogPost = await createBlogPost(
        title,
        content,
        selectedCountry.name,
        visitDate
      );

      toast({ title: "Success", description: "Post created!" });
      router.push(`/posts/${blogPost.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Post creation failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (redirectToLogin) return null;

  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Travel Post</CardTitle>
          <CardDescription>Share your travel experience</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
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
              />
              {isSearching && <p className="text-xs mt-1">Searching...</p>}
              {!isSearching && countryResults.length > 0 && (
                // <div className="mt-2 border rounded bg-white shadow">
                <div className="mt-2 border rounded bg-background shadow max-h-60 overflow-y-auto">
                  {countryResults.map((country) => (
                    <div
                      key={country.name}
                      onClick={() => handleCountrySelect(country)}
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

            {selectedCountry && (
              <Card className="mt-4 border">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <img src={selectedCountry.flag} alt={selectedCountry.name} className="w-16 h-10 rounded shadow" />
                    <h3 className="font-medium text-lg">{selectedCountry.name}</h3>
                  </div>
                  <div className="mt-4 text-sm">
                    <p><strong>Capital:</strong> {selectedCountry.capital}</p>
                    <p><strong>Currency:</strong> {selectedCountry.currencyName} ({selectedCountry.currencySymbol})</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <Label htmlFor="visitDate">Date of Visit</Label>
              <Input id="visitDate" type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="ml-auto">
              {isLoading ? "Creating..." : "Create Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

