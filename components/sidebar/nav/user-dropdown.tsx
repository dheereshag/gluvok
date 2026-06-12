"use client"

import { SparklesIcon, BadgeCheckIcon, CreditCardIcon, BellIcon, LogOutIcon } from "lucide-react"
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Status, StatusIndicator, StatusLabel } from "@/components/kibo-ui/status"
import { UserAvatarInfo, type UserInfo } from "./user-info"

interface NavUserDropdownProps {
  user: UserInfo
  isMobile: boolean
}

const MENU_ITEMS = [
  { id: "user-menu-account", label: "Account", icon: BadgeCheckIcon },
  { id: "user-menu-billing", label: "Billing", icon: CreditCardIcon },
  { id: "user-menu-notifications", label: "Notifications", icon: BellIcon },
]

export function NavUserDropdown({ user, isMobile }: NavUserDropdownProps) {
  return (
    <DropdownMenuContent
      className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      side={isMobile ? "bottom" : "right"}
      align="end"
      sideOffset={4}
    >
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm justify-between">
          <div className="flex items-center gap-2">
            <UserAvatarInfo user={user} />
          </div>
          <Status status="online" className="text-[10px] h-5 py-0 px-2 rounded-full border-none bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <StatusIndicator />
            <StatusLabel />
          </Status>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem id="user-menu-upgrade">
          <SparklesIcon className="mr-2 h-4 w-4" /> Upgrade to Pro
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <DropdownMenuItem key={item.id} id={item.id}>
              <Icon className="mr-2 h-4 w-4" /> {item.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem id="user-menu-logout" className="text-destructive focus:text-destructive focus:bg-destructive/10">
        <LogOutIcon className="mr-2 h-4 w-4 text-destructive" /> Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
