"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

type AuthModalProps = {
  isOpen: boolean
  onClose: () => void
  action?: string
}

export function AuthModal({ isOpen, onClose, action = "interact" }: AuthModalProps) {
  const [open, setOpen] = useState(isOpen)
  const router = useRouter()

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  const handleLogin = () => {
    router.push("/login")
    handleClose()
  }

  const handleRegister = () => {
    router.push("/register")
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Authentication Required</DialogTitle>
          <DialogDescription>You need to be logged in to {action} with TravelTales.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-center text-sm text-muted-foreground">
            Please log in to your account or create a new account to access all features.
          </p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto" onClick={handleLogin}>
            Log In
          </Button>
          <Button className="w-full sm:w-auto" onClick={handleRegister}>
            Sign Up
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
