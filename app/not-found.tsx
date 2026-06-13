"use client"

import Link from "next/link"
import { Compass, Home } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger id="sidebar-trigger-not-found" className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1.5 font-medium text-muted-foreground">
                  404 Not Found
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center flex-1 p-6 md:p-12 text-center select-none min-h-[calc(100vh-4rem)]">
        <div className="max-w-md w-full space-y-8 flex flex-col items-center justify-center">
          {/* Animated illustration container */}
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500 scale-110" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-card border shadow-sm group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
              <Compass className="h-12 w-12 text-primary animate-pulse" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              Page Not Found
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
              We couldn't find the page you are looking for. It might have been moved, deleted, or never existed.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 w-full">
            <Button asChild variant="outline" className="gap-2 h-10 px-4 active:scale-98 transition-all">
              <Link href="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}
