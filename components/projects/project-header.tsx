import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

interface ProjectHeaderProps {
  projectSlug: string;
  projectName: string;
  Icon: React.ComponentType<{ className?: string }>;
}

export function ProjectHeader({ projectSlug, projectName, Icon }: ProjectHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger id={`sidebar-trigger-${projectSlug}`} className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link id={`breadcrumb-home-${projectSlug}`} href="/" className="flex items-center gap-1">
                  <LayoutDashboard className="h-3 w-3" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-1 font-medium text-foreground">
                <Icon className="h-3 w-3" />
                {projectName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}

interface ProjectTitleProps {
  projectName: string;
  Icon: React.ComponentType<{ className?: string }>;
}

export function ProjectTitle({ projectName, Icon }: ProjectTitleProps) {
  return (
    <div className="flex flex-col gap-1.5 mb-6">
      <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
        <Icon className="h-6 w-6 text-primary" />
        {projectName}
      </h1>
      <p className="text-sm text-muted-foreground">
        Manage the directory of {projectName.toLowerCase()}, edit records, and configure settings.
      </p>
    </div>
  );
}
