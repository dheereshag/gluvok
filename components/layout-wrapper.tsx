"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AuthGuard } from "@/components/auth/guard"
import { AppRoutes } from "@/lib/constants"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage =
    pathname === AppRoutes.LOGIN ||
    pathname === AppRoutes.SIGNUP ||
    pathname === AppRoutes.FORGOT_PASSWORD ||
    pathname === AppRoutes.RESET_PASSWORD

  if (isAuthPage) {
    return <AuthGuard>{children}</AuthGuard>
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
