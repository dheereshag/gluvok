"use client"

import Link from "next/link"
import { ChevronRightIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuAction, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon: React.ReactNode
  isActive?: boolean
  items?: { title: string; url: string }[]
}

export function NavMainItem({ item }: { item: NavItem }) {
  const mainLinkId = `sidebar-link-${item.title.toLowerCase().replace(/\s+/g, "-")}`
  return (
    <Collapsible asChild defaultOpen={item.isActive}>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={item.title}>
          <Link id={mainLinkId} href={item.url}>{item.icon}<span>{item.title}</span></Link>
        </SidebarMenuButton>
        {item.items?.length ? (
          <>
            <CollapsibleTrigger asChild>
              <SidebarMenuAction id={`${mainLinkId}-toggle`} className="data-[state=open]:rotate-90">
                <ChevronRightIcon /><span className="sr-only">Toggle</span>
              </SidebarMenuAction>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items.map((subItem) => {
                  const subLinkId = `sidebar-link-${subItem.title.toLowerCase().replace(/\s+/g, "-")}`
                  return (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link id={subLinkId} href={subItem.url}><span>{subItem.title}</span></Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </>
        ) : null}
      </SidebarMenuItem>
    </Collapsible>
  )
}
