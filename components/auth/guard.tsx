"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore, useEntitiesStore, hasPageAccess } from "@/lib/store"
import { AppRoutes } from "@/lib/constants/enums"
import { AUTH_ROUTES } from "@/lib/constants"
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

  // Mark both stores as hydrated after mount (avoids React 19 state-update-before-mount warning)
  useEffect(() => {
    useAuthStore.getState().setHydrated(true)
    useEntitiesStore.getState().setHydrated(true)
    const unsubscribe = useAuthStore.getState().initAuth()
    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!authHydrated) return

    switch (true) {
      // 1. Unauthenticated users trying to access protected pages
      case !user && !isAuthPage:
        router.push(AppRoutes.LOGIN)
        break

      // 2. Authenticated users trying to access general auth pages (except password reset)
      case !!user && isAuthPage && pathname !== AppRoutes.RESET_PASSWORD:
        router.push(AppRoutes.HOME)
        break

      // 3. Authenticated users trying to access projects they don't have access to
      case !!user && !!projectSlug && !isAuthorized:
        toast.error("Access Denied: You do not have permission to access this page")
        router.push(AppRoutes.HOME)
        break

      default:
        break
    }
  }, [user, authHydrated, isAuthPage, pathname, projectSlug, isAuthorized, router])

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
