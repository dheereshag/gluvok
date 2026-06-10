import { Metadata } from "next";
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
  Folder
} from "lucide-react";

const PROJECT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  centers: Building,
  commodities: Package,
  customers: Users,
  "data-entries": ClipboardList,
  factories: Factory,
  operators: UserCog,
  users: User,
  villages: Home,
};

function titleize(slug: string) {
  return slug
    .replace(/[-_]+/g, " ")
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ")
}

type Props = {
  params: Promise<{ project: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const projectSlug = resolvedParams?.project || "project";
  const projectName = titleize(projectSlug);
  return {
    title: `${projectName} | gluvok Dashboard`,
    description: `Manage and track ${projectName} entities on the gluvok platform.`,
  };
}

export default async function ProjectPage({ params }: Props) {
  const resolvedParams = await params;
  const projectSlug = resolvedParams?.project || "project";
  const projectName = titleize(projectSlug);
  const IconComponent = PROJECT_ICONS[projectSlug] || Folder;

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger id="sidebar-trigger-project" className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link id="project-breadcrumb-home-link" href="/" className="flex items-center gap-1">
                    <LayoutDashboard className="h-3 w-3" />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1 font-medium text-foreground">
                  <IconComponent className="h-3 w-3" />
                  {projectName}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="p-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <IconComponent className="h-6 w-6 text-primary" />
          {projectName}
        </h1>
        <p className="mt-4 text-muted-foreground">
          Content for {projectName} goes here.
        </p>
      </main>
    </>
  );
}
