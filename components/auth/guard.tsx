"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { AppRoutes } from "@/lib/constants"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user)
  const hydrated = useAuthStore((state) => state.hydrated)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!hydrated) return

    const isAuthPage = pathname === AppRoutes.LOGIN || pathname === AppRoutes.SIGNUP

    if (!user && !isAuthPage) {
      router.push(AppRoutes.LOGIN)
    } else if (user && isAuthPage) {
      router.push(AppRoutes.HOME)
    }
  }, [user, hydrated, pathname, router])

  // Show loading during initial rehydration to prevent UI flash
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-xs font-mono text-muted-foreground">
        Loading...
      </div>
    )
  }

  const isAuthPage = pathname === AppRoutes.LOGIN || pathname === AppRoutes.SIGNUP

  if (!user && !isAuthPage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-xs font-mono text-muted-foreground">
        Redirecting...
      </div>
    )
  }

  return <>{children}</>
}
