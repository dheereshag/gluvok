"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Building,
  Package,
  Users,
  ClipboardList,
  Factory,
  UserCog,
  User,
  Home,
  LifeBuoy,
  Send,
  Weight
} from "lucide-react"
import Link from "next/link";
import { ProjectSlug } from "@/lib/fields"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: <LifeBuoy />,
    },
    {
      title: "Feedback",
      url: "#",
      icon: <Send />,
    },
  ],
  navMain: [
    {
      title: "Centers",
      url: `/projects/${ProjectSlug.CENTERS}`,
      icon: <Building />,
    },
    {
      title: "Commodities",
      url: `/projects/${ProjectSlug.COMMODITIES}`,
      icon: <Package />,
    },
    {
      title: "Customers",
      url: `/projects/${ProjectSlug.CUSTOMERS}`,
      icon: <Users />,
    },
    {
      title: "Data Entries",
      url: `/projects/${ProjectSlug.DATA_ENTRIES}`,
      icon: <ClipboardList />,
    },
    {
      title: "Factories",
      url: `/projects/${ProjectSlug.FACTORIES}`,
      icon: <Factory />,
    },
    {
      title: "Operators",
      url: `/projects/${ProjectSlug.OPERATORS}`,
      icon: <UserCog />,
    },
    {
      title: "Users",
      url: `/projects/${ProjectSlug.USERS}`,
      icon: <User />,
    },
    {
      title: "Villages",
      url: `/projects/${ProjectSlug.VILLAGES}`,
      icon: <Home />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Weight className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">gluvok</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
