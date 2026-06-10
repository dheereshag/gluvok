"use client"

import * as React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"
import {
  Home,
  LayoutDashboard,
  Building,
  Package,
  Users,
  ClipboardList,
  Factory,
  UserCog,
  User,
  ArrowRight,
  Weight,
} from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { StateCombobox } from "@/components/state-combobox"

export default function Page() {
  const [testState, setTestState] = React.useState("")

  const cards = [
    { name: "Centers", href: "/projects/centers", desc: "Manage processing and collection centers", icon: Building, color: "text-blue-500" },
    { name: "Commodities", href: "/projects/commodities", desc: "Track trading products and goods catalog", icon: Package, color: "text-amber-500" },
    { name: "Customers", href: "/projects/customers", desc: "Directory of client accounts and details", icon: Users, color: "text-green-500" },
    { name: "Data Entries", href: "/projects/data-entries", desc: "Input logs, sheets and record metrics", icon: ClipboardList, color: "text-purple-500" },
    { name: "Factories", href: "/projects/factories", desc: "Configure manufacturing plants and lines", icon: Factory, color: "text-indigo-500" },
    { name: "Operators", href: "/projects/operators", desc: "Manage workers and field operatives", icon: UserCog, color: "text-pink-500" },
    { name: "Users", href: "/projects/users", desc: "Configure access control and team profiles", icon: User, color: "text-teal-500" },
    { name: "Villages", href: "/projects/villages", desc: "Database of geographical areas and metadata", icon: Home, color: "text-rose-500" },
  ]

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger id="sidebar-trigger-home" className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1.5 font-medium">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Home
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="p-8 max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2.5 text-foreground">
            <Weight className="h-8 w-8 text-primary" />
            gluvok Dashboard
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl">
            Welcome back. Access the platform tools, manage entities, configure visibility settings, and track operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => {
            const Icon = card.icon
            const cardId = `dashboard-card-${card.name.toLowerCase().replace(/\s+/g, "-")}`
            return (
              <Link
                key={card.name}
                href={card.href}
                id={cardId}
                className="group block"
              >
                <Card className="h-full border bg-card hover:border-muted-foreground/50 hover:bg-accent/50 transition-colors duration-200 cursor-pointer">
                  <CardHeader className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2.5 rounded-xl bg-muted/50 group-hover:bg-primary/10 transition-colors duration-200 ${card.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                    </div>
                    <CardTitle className="font-bold text-sm text-card-foreground group-hover:text-primary leading-none">
                      {card.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {card.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </main>
    </>
  )
}
