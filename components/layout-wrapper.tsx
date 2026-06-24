"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AuthGuard } from "@/components/auth/guard"
import { AppRoutes } from "@/lib/constants/enums"
import { AUTH_ROUTES } from "@/lib/constants"
import { useAuthStore } from "@/lib/store"
import { UnlinkedProfile } from "@/components/auth/unlinked-profile"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = AUTH_ROUTES.includes(pathname as AppRoutes)
  const user = useAuthStore((state) => state.user)

  if (isAuthPage) {
    return <AuthGuard>{children}</AuthGuard>
  }

  // If user is authenticated but has no profile linked
  if (user && !user.profile) {
    return (
      <AuthGuard>
        <UnlinkedProfile />
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}
