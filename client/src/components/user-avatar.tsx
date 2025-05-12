"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type User = {
  id?: number
  username: string
  email?: string
}

type UserAvatarProps = {
  user: User
  className?: string
  onClick?: () => void
}

export function UserAvatar({ user, className, onClick }: UserAvatarProps) {
  return (
    <Avatar
      className={`h-8 w-8 ${className || ""}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} alt={user.username} />
      <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}
