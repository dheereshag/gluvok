"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { MoreHorizontalIcon } from "lucide-react"
import Link from "next/link"

export function NavProjects({
  projects,
  label = "Projects",
}: {
  projects: {
    name: string;
    url: string;
    icon: React.ReactNode;
  }[];
  label?: string;
}) {

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => {
          const linkId = `sidebar-link-${item.name.toLowerCase().replace(/\s+/g, "-")}`
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link id={linkId} href={item.url}>
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
        <SidebarMenuItem>
          <SidebarMenuButton id="sidebar-link-more">
            <MoreHorizontalIcon />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
