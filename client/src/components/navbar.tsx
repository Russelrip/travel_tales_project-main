"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { useSession } from "@/components/auth-provider"
import { UserAvatar } from "@/components/user-avatar"
import { Search, Home, LogOut, User, PenSquare, Users } from "lucide-react"

export default function Navbar() {
  const router = useRouter()
  const { session, signOut } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Close the menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">TravelTales</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Home className="mr-1 h-4 w-4" />
              Home
            </Link>
            <Link
              href="/search"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Search className="mr-1 h-4 w-4" />
              Explore
            </Link>
            {session && (
              <Link
                href="/feed"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <Users className="mr-1 h-4 w-4" />
                Following Feed
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden md:flex">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts or users..."
                className="w-[200px] pl-8 md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          {session ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-background hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                aria-label="Open user menu"
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
              >
                <UserAvatar user={session.user} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border bg-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="p-2">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <UserAvatar user={session.user} />
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{session.user.username}</p>
                        <p className="text-sm text-muted-foreground">{session.user.email}</p>
                      </div>
                    </div>
                    <div className="h-px bg-border my-1" />
                    <Link
                      href={`/users/${session.user.username}`}
                      className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      href="/posts/new"
                      className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <PenSquare className="mr-2 h-4 w-4" />
                      New Post
                    </Link>
                    <div className="h-px bg-border my-1" />
                    <button
                      className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                      onClick={async () => {
                        await signOut();
                        setIsMenuOpen(false);
                        router.push("/");
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
