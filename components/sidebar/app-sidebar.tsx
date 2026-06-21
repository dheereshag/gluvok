"use client"

import * as React from "react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"

import { NavMain } from "./nav/main"
import { NavSecondary } from "./nav/secondary"
import { NavUser } from "./nav/user"
import { SIDEBAR_DATA } from "./data"
import { useAuthStore, hasPageAccess } from "@/lib/store"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((state) => state.user)
  const hydrated = useAuthStore((state) => state.hydrated)

  const activeUser = {
    name: (hydrated && user?.name) || SIDEBAR_DATA.user.name,
    email: (hydrated && user?.email) || SIDEBAR_DATA.user.email,
    avatar: (hydrated && user?.avatar) || SIDEBAR_DATA.user.avatar,
  }

  const filteredNavMain = React.useMemo(() => {
    if (!hydrated || !user) return []
    return SIDEBAR_DATA.navMain.filter((item) => {
      const slug = item.url.split("/").pop() || ""
      return hasPageAccess(user.role, slug)
    })
  }, [hydrated, user])

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Logo size={32} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">gluvok</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavSecondary items={SIDEBAR_DATA.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={activeUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
