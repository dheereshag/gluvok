"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { AppRoutes, AUTH_ROUTES } from "@/lib/constants"

function FullScreenStatus({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-xs font-mono text-muted-foreground">
      {message}
    </div>
  )
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user)
  const hydrated = useAuthStore((state) => state.hydrated)
  const router = useRouter()
  const pathname = usePathname()

  const isAuthPage = AUTH_ROUTES.includes(pathname as AppRoutes)

  useEffect(() => {
    if (!hydrated) return

    if (!user && !isAuthPage) {
      router.push(AppRoutes.LOGIN)
    } else if (user && isAuthPage) {
      router.push(AppRoutes.HOME)
    }
  }, [user, hydrated, isAuthPage, router])

  // Show loading during initial rehydration to prevent UI flash
  if (!hydrated) {
    return <FullScreenStatus message="Loading..." />
  }

  if (!user && !isAuthPage) {
    return <FullScreenStatus message="Redirecting..." />
  }

  return <>{children}</>
}
