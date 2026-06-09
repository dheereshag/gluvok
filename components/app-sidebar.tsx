"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
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
import { TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, LifeBuoyIcon, SendIcon, FrameIcon, PieChartIcon, MapIcon, TerminalIcon } from "lucide-react"
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
      icon: <LifeBuoyIcon />,
    },
    {
      title: "Feedback",
      url: "#",
      icon: <SendIcon />,
    },
  ],
  projects: [
    {
      name: "Centers",
      url: "/projects/centers",
      icon: <FrameIcon />,
    },
    {
      name: "Commodities",
      url: "/projects/commodities",
      icon: <PieChartIcon />,
    },
    {
      name: "Customers",
      url: "/projects/customers",
      icon: <MapIcon />,
    },
    {
      name: "Data Entries",
      url: "/projects/data-entries",
      icon: <TerminalIcon />,
    },
    {
      name: "Factories",
      url: "/projects/factories",
      icon: <TerminalSquareIcon />,
    },
    {
      name: "Operators",
      url: "/projects/operators",
      icon: <BotIcon />,
    },
    {
      name: "Users",
      url: "/projects/users",
      icon: <BookOpenIcon />,
    },
    {
      name: "Villages",
      url: "/projects/villages",
      icon: <Settings2Icon />,
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
                  <TerminalIcon className="size-4" />
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
