"use client"

import * as React from "react"

import { NavProjects } from "@/components/nav-projects"
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
  Terminal
} from "lucide-react"
import Link from "next/link";

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
  projects: [
    {
      name: "Centers",
      url: "/projects/centers",
      icon: <Building />,
    },
    {
      name: "Commodities",
      url: "/projects/commodities",
      icon: <Package />,
    },
    {
      name: "Customers",
      url: "/projects/customers",
      icon: <Users />,
    },
    {
      name: "Data Entries",
      url: "/projects/data-entries",
      icon: <ClipboardList />,
    },
    {
      name: "Factories",
      url: "/projects/factories",
      icon: <Factory />,
    },
    {
      name: "Operators",
      url: "/projects/operators",
      icon: <UserCog />,
    },
    {
      name: "Users",
      url: "/projects/users",
      icon: <User />,
    },
    {
      name: "Villages",
      url: "/projects/villages",
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
                  <Terminal className="size-4" />
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
        <NavProjects projects={data.projects} label="Platform" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
