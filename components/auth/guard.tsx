"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore, useEntitiesStore } from "@/lib/store"
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
  const authHydrated = useAuthStore((state) => state.hydrated)
  const entitiesHydrated = useEntitiesStore((state) => state.hydrated)
  const router = useRouter()
  const pathname = usePathname()

  const isAuthPage = AUTH_ROUTES.includes(pathname as AppRoutes)

  useEffect(() => {
    if (!authHydrated) return

    if (!user && !isAuthPage) {
      router.push(AppRoutes.LOGIN)
    } else if (user && isAuthPage) {
      router.push(AppRoutes.HOME)
    }
  }, [user, authHydrated, isAuthPage, router])

  // Show loading during initial rehydration to prevent UI flash
  if (!authHydrated || !entitiesHydrated) {
    return <FullScreenStatus message="Loading..." />
  }

  if (!user && !isAuthPage) {
    return <FullScreenStatus message="Redirecting..." />
  }

  return <>{children}</>
}
