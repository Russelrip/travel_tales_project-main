// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
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

// export default function NewPostPage() {
//   const [title, setTitle] = useState("")
//   const [content, setContent] = useState("")
//   const [country, setCountry] = useState("")
//   const [visitDate, setVisitDate] = useState(format(new Date(), "yyyy-MM-dd"))
//   const [isLoading, setIsLoading] = useState(false)
//   const [countries, setCountries] = useState<Country[]>([])
//   const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
//   const [isLoadingCountries, setIsLoadingCountries] = useState(true)

//   const router = useRouter()
//   const { toast } = useToast()
//   const { session } = useSession()
//   const [redirectToLogin, setRedirectToLogin] = useState(false)

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
//     if (!session) {
//       setRedirectToLogin(true)
//     }
//   }, [session])

//   useEffect(() => {
//     if (redirectToLogin) {
//       router.push("/login?redirect=/posts/new")
//     }
//   }, [redirectToLogin, router])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       const response = await fetch("/api/posts", {
//         method: "POST",
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
//         throw new Error(error.message || "Failed to create post")
//       }

//       const data = await response.json()
//       toast({
//         title: "Success",
//         description: "Your post has been created successfully",
//       })
//       router.push(`/posts/${data.post.id}`)
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to create post",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (redirectToLogin) {
//     return null
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
//           <CardTitle>Create a New Travel Post</CardTitle>
//           <CardDescription>Share your travel experience with the community</CardDescription>
//         </CardHeader>
//         <form onSubmit={handleSubmit}>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="title">Title</Label>
//               <Input
//                 id="title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="My Amazing Trip to..."
//                 required
//               />
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
//                 placeholder="Share your experience..."
//                 className="min-h-[200px]"
//                 required
//               />
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button type="submit" disabled={isLoading} className="ml-auto">
//               {isLoading ? "Creating..." : "Create Post"}
//             </Button>
//           </CardFooter>
//         </form>
//       </Card>
//     </div>
//   )
// }

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
import { createBlogPost } from "@/services/blogService";     // ✅ use your API
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

  // ✅ Debounced search
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

