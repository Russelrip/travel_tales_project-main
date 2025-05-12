"use client"

import { useState } from "react"
import { useSession } from "@/components/auth-provider"
import { AuthModal } from "@/components/auth-modal"
import { useRouter } from "next/navigation"

export function useAuthCheck() {
  const { session } = useSession()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authAction, setAuthAction] = useState("interact")
  const router = useRouter()

  const checkAuth = (action = "interact", redirectToLogin = false) => {
    if (!session) {
      if (redirectToLogin) {
        router.push("/login")
        return false
      }

      setAuthAction(action)
      setShowAuthModal(true)
      return false
    }
    return true
  }

  const closeAuthModal = () => {
    setShowAuthModal(false)
  }

  const AuthModalComponent = showAuthModal ? (
    <AuthModal isOpen={showAuthModal} onClose={closeAuthModal} action={authAction} />
  ) : null

  return {
    isAuthenticated: !!session,
    checkAuth,
    AuthModalComponent,
  }
}
