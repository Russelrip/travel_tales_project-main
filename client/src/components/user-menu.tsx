"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { UserAvatar } from "@/components/user-avatar"
import { User, PenSquare, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "@/components/auth-provider"

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { session, signOut } = useSession()
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)

  // Close the menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (!session) return null

  console.log("User in menu:", session.user)

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-background hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
        aria-label="Open user menu"
      >
        <UserAvatar user={session.user} onClick={() => setIsOpen(!isOpen)} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border bg-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-2">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{session.user.username}</p>
                <p className="text-sm text-muted-foreground">{session.user.email}</p>
              </div>
            </div>
            <div className="h-px bg-border my-1" />
            <Link
              href={`/users/${session.user.username}`}
              className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/posts/new"
              className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              <PenSquare className="mr-2 h-4 w-4" />
              New Post
            </Link>
            <div className="h-px bg-border my-1" />
            <button
              className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
              onClick={() => {
                signOut()
                router.push("/")
                setIsOpen(false)
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
