// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { useToast } from "@/components/ui/use-toast"
// import { useSession } from "@/components/auth-provider"
// import { format } from "date-fns"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { DollarSign, Building } from "lucide-react"

// // Country type definition
// type Country = {
//   name: {
//     common: string
//     official: string
//   }
//   flags: {
//     png: string
//     svg: string
//     alt?: string
//   }
//   capital?: string[]
//   currencies?: Record<
//     string,
//     {
//       name: string
//       symbol: string
//     }
//   >
//   cca2: string
// }

// export default function EditPostPage() {
//   const params = useParams()
//   const postId = params?.id as string
//   const [title, setTitle] = useState("")
//   const [content, setContent] = useState("")
//   const [country, setCountry] = useState("")
//   const [visitDate, setVisitDate] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [isFetching, setIsFetching] = useState(true)
//   const [countries, setCountries] = useState<Country[]>([])
//   const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
//   const [isLoadingCountries, setIsLoadingCountries] = useState(true)

//   const router = useRouter()
//   const { toast } = useToast()
//   const { session } = useSession()
//   const [redirectToLogin, setRedirectToLogin] = useState(false)

//   useEffect(() => {
//     if (!session) {
//       setRedirectToLogin(true)
//     }
//   }, [session])

//   useEffect(() => {
//     if (redirectToLogin) {
//       router.push("/login")
//     }
//   }, [redirectToLogin, router])

//   // Fetch countries list
//   useEffect(() => {
//     async function fetchCountries() {
//       try {
//         const response = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,capital,currencies,cca2")
//         if (response.ok) {
//           const data = await response.json()
//           // Sort countries by name
//           const sortedCountries = data.sort((a: Country, b: Country) => a.name.common.localeCompare(b.name.common))
//           setCountries(sortedCountries)
//         } else {
//           toast({
//             title: "Error",
//             description: "Failed to load countries list",
//             variant: "destructive",
//           })
//         }
//       } catch (error) {
//         console.error("Error fetching countries:", error)
//         toast({
//           title: "Error",
//           description: "Failed to load countries list",
//           variant: "destructive",
//         })
//       } finally {
//         setIsLoadingCountries(false)
//       }
//     }

//     fetchCountries()
//   }, [toast])

//   // Handle country selection
//   const handleCountryChange = (value: string) => {
//     setCountry(value)
//     const country = countries.find((c) => c.name.common === value)
//     setSelectedCountry(country || null)
//   }

//   useEffect(() => {
//     const fetchPost = async () => {
//       if (!postId || !session) return

//       try {
//         const response = await fetch(`/api/posts/${postId}`)

//         if (!response.ok) {
//           throw new Error("Failed to fetch post")
//         }

//         const data = await response.json()

//         // Check if user is the author
//         if (data.post.author.id !== session.user.id) {
//           toast({
//             title: "Unauthorized",
//             description: "You can only edit your own posts",
//             variant: "destructive",
//           })
//           router.push(`/posts/${postId}`)
//           return
//         }

//         setTitle(data.post.title)
//         setContent(data.post.content)
//         setCountry(data.post.country)
//         setVisitDate(format(new Date(data.post.visitDate), "yyyy-MM-dd"))

//         // Set selected country if it exists in the countries list
//         if (countries.length > 0) {
//           const country = countries.find((c) => c.name.common === data.post.country)
//           setSelectedCountry(country || null)
//         }
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "Failed to fetch post",
//           variant: "destructive",
//         })
//         router.push("/")
//       } finally {
//         setIsFetching(false)
//       }
//     }

//     if (session && countries.length > 0) {
//       fetchPost()
//     } else if (session) {
//       setIsFetching(false)
//     }
//   }, [postId, router, session, toast, countries])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       const response = await fetch(`/api/posts/${postId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           title,
//           content,
//           country,
//           visitDate,
//         }),
//       })

//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.message || "Failed to update post")
//       }

//       toast({
//         title: "Success",
//         description: "Your post has been updated successfully",
//       })
//       router.push(`/posts/${postId}`)
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to update post",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (redirectToLogin) {
//     return null
//   }

//   if (isFetching) {
//     return (
//       <div className="container max-w-3xl py-10">
//         <Card>
//           <CardHeader>
//             <CardTitle>Loading...</CardTitle>
//           </CardHeader>
//         </Card>
//       </div>
//     )
//   }

//   // Format currency information
//   const formatCurrency = (currencies?: Record<string, { name: string; symbol: string }>) => {
//     if (!currencies) return "N/A"

//     return Object.entries(currencies)
//       .map(([code, { name, symbol }]) => `${name} (${symbol})`)
//       .join(", ")
//   }

//   // Format capital information
//   const formatCapital = (capital?: string[]) => {
//     if (!capital || capital.length === 0) return "N/A"
//     return capital.join(", ")
//   }

//   return (
//     <div className="container max-w-3xl py-10">
//       <Card>
//         <CardHeader>
//           <CardTitle>Edit Travel Post</CardTitle>
//           <CardDescription>Update your travel experience</CardDescription>
//         </CardHeader>
//         <form onSubmit={handleSubmit}>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="title">Title</Label>
//               <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="country">Country</Label>
//               <Select onValueChange={handleCountryChange} value={country}>
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Select a country" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {isLoadingCountries ? (
//                     <div className="p-2 text-center">Loading countries...</div>
//                   ) : (
//                     countries.map((country) => (
//                       <SelectItem key={country.cca2} value={country.name.common}>
//                         <div className="flex items-center">
//                           <img
//                             src={country.flags.svg || "/placeholder.svg"}
//                             alt={country.flags.alt || `Flag of ${country.name.common}`}
//                             className="w-5 h-3 mr-2 object-cover"
//                           />
//                           {country.name.common}
//                         </div>
//                       </SelectItem>
//                     ))
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>

//             {selectedCountry && (
//               <Card className="bg-muted/50 border-muted">
//                 <CardContent className="p-4 space-y-3">
//                   <div className="flex items-center space-x-3">
//                     <img
//                       src={selectedCountry.flags.svg || "/placeholder.svg"}
//                       alt={selectedCountry.flags.alt || `Flag of ${selectedCountry.name.common}`}
//                       className="w-16 h-10 object-cover rounded shadow-sm"
//                     />
//                     <h3 className="font-medium text-lg">{selectedCountry.name.common}</h3>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
//                     <div className="flex items-center gap-2">
//                       <Building className="h-4 w-4 text-muted-foreground" />
//                       <span className="font-medium">Capital:</span>
//                       {formatCapital(selectedCountry.capital)}
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <DollarSign className="h-4 w-4 text-muted-foreground" />
//                       <span className="font-medium">Currency:</span>
//                       {formatCurrency(selectedCountry.currencies)}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             <div className="space-y-2">
//               <Label htmlFor="visitDate">Date of Visit</Label>
//               <Input
//                 id="visitDate"
//                 type="date"
//                 value={visitDate}
//                 onChange={(e) => setVisitDate(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="content">Content</Label>
//               <Textarea
//                 id="content"
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 className="min-h-[200px]"
//                 required
//               />
//             </div>
//           </CardContent>
//           <CardFooter className="flex justify-between">
//             <Button type="button" variant="outline" onClick={() => router.push(`/posts/${postId}`)}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isLoading}>
//               {isLoading ? "Updating..." : "Update Post"}
//             </Button>
//           </CardFooter>
//         </form>
//       </Card>
//     </div>
//   )
// }

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

  // ✅ auth check
  useEffect(() => {
    if (!session) {
      router.push("/login?redirect=/posts/" + postId + "/edit");
    }
  }, [session, router, postId]);

  // ✅ fetch post
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

  // ✅ country search debounce
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

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!selectedCountry) {
  //     toast({ title: "Error", description: "Please select a country", variant: "destructive" });
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
  //     await updateBlogPost(postId, {
  //       title,
  //       content,
  //       countryName: selectedCountry.name,
  //       dateOfVisit: visitDate,
  //     });

  //     toast({ title: "Success", description: "Post updated!" });
  //     router.push(`/posts/${postId}`);
  //   } catch (error: any) {
  //     toast({
  //       title: "Error",
  //       description: error.message || "Update failed",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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



