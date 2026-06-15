"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore, hasPageAccess } from "@/lib/store"
import { AppRoutes, AUTH_ROUTES } from "@/lib/constants"
import { toast } from "sonner"

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

  const router = useRouter()
  const pathname = usePathname()

  const isAuthPage = AUTH_ROUTES.includes(pathname as AppRoutes)
  const projectMatch = pathname.match(/^\/projects\/([^/]+)/)
  const projectSlug = projectMatch ? projectMatch[1] : null

  const isAuthorized = !user || !projectSlug || hasPageAccess(user.role, projectSlug)

  useEffect(() => {
    if (!authHydrated) return

    if (!user && !isAuthPage) {
      router.push(AppRoutes.LOGIN)
    } else if (user && isAuthPage) {
      router.push(AppRoutes.HOME)
    } else if (user && projectSlug && !isAuthorized) {
      toast.error("Access Denied: You do not have permission to access this page")
      router.push(AppRoutes.HOME)
    }
  }, [user, authHydrated, isAuthPage, projectSlug, isAuthorized, router])

  // Show loading during initial rehydration to prevent UI flash
  if (!authHydrated) {
    return <FullScreenStatus message="Loading..." />
  }

  if (!user && !isAuthPage) {
    return <FullScreenStatus message="Redirecting..." />
  }

  if (user && projectSlug && !isAuthorized) {
    return <FullScreenStatus message="Access Denied..." />
  }

  return <>{children}</>
}
