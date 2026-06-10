import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Home, Folder } from "lucide-react";

function titleize(slug: string) {
  return slug
    .replace(/[-_]+/g, " ")
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ")
}

export default async function ProjectPage({
  params,
}: {
  params: { project: string } | Promise<{ project: string }>;
}) {
  const resolvedParams = await params;
  const projectSlug = resolvedParams?.project || "project";
  const projectName = titleize(projectSlug);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="flex items-center gap-1">
                    <Link href="/" className="flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      Home
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1">
                    <Folder className="h-3 w-3" />
                    {projectName}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="p-6">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Folder className="h-6 w-6 text-primary" />
            {projectName}
          </h1>
          <p className="mt-4 text-muted-foreground">
            Content for {projectName} goes here.
          </p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
