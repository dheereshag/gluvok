"use client"

import * as React from "react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { LayoutDashboard, RotateCw } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { PROJECTS } from "@/lib/projects"
import { DashboardCard } from "@/components/dashboard"
import { useAuthStore, hasPageAccess, resetAllEntitiesData } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function Page() {
  const user = useAuthStore((state) => state.user)
  const hydrated = useAuthStore((state) => state.hydrated)
  const [isReloading, setIsReloading] = React.useState(false)

  const filteredProjects = React.useMemo(() => {
    if (!hydrated || !user) return []
    return PROJECTS.filter((p) => hasPageAccess(user.role, p.slug))
  }, [hydrated, user])

  const handleReload = React.useCallback(() => {
    setIsReloading(true)
    resetAllEntitiesData()
    setTimeout(() => {
      setIsReloading(false)
      toast.success("All tables reloaded", {
        description: "Reset all dashboard data back to initial seed state.",
      })
    }, 600)
  }, [])

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger id="sidebar-trigger-home" className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
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

      <main className="p-8 w-full min-w-0 space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2 flex flex-col items-start text-left">
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2.5 text-foreground">
              <Logo size={32} />
              gluvok Dashboard
            </h1>
            <p className="text-muted-foreground text-sm max-w-xl">
              Welcome back. Access the platform tools, manage entities, configure visibility settings, and track operations.
            </p>
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReload}
              disabled={isReloading}
              className="h-9 gap-2 shadow-sm font-semibold transition-all duration-300 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
            >
              <RotateCw className={`h-4 w-4 ${isReloading ? "animate-spin" : ""}`} />
              Reload and Reset Data
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredProjects.map((project) => (
            <DashboardCard
              key={project.name}
              name={project.name}
              href={`/projects/${project.slug}`}
              desc={project.desc}
              icon={project.icon}
              color={project.color}
            />
          ))}
        </div>
      </main>
    </>
  )
}
