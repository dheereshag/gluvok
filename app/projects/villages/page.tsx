import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Home, LayoutDashboard } from "lucide-react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { villages as initialVillages } from "@/data/villages"

export default function VillagesPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/" className="flex items-center gap-1 font-medium hover:text-primary transition-colors">
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      Home
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1 font-medium">
                    <Home className="h-3.5 w-3.5" />
                    Villages
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="p-6 max-w-7xl">
          <div className="flex flex-col gap-1.5 mb-6">
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
              <Home className="h-6 w-6 text-primary" />
              Villages
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage the directory of villages, edit records, and configure visibility.
            </p>
          </div>
          <DataTable columns={columns} initialData={initialVillages} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
