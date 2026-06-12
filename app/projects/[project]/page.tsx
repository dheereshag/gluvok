import { Metadata } from "next";
import { notFound } from "next/navigation";
import { type EntityRecord } from "@/types";
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
} from "lucide-react";

import { centers } from "@/data/centers";
import { commodities } from "@/data/commodities";
import { customers } from "@/data/customers";
import { dataEntries } from "@/data/data-entries";
import { factories } from "@/data/factories";
import { operators } from "@/data/operators";
import { users } from "@/data/users";
import { villages } from "@/data/villages";
import { ProjectClient } from "./project-client";

const PROJECT_REGISTRY: Record<
  string,
  {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    data: EntityRecord[];
  }
> = {
  centers: { name: "Centers", icon: Building, data: centers },
  commodities: { name: "Commodities", icon: Package, data: commodities },
  customers: { name: "Customers", icon: Users, data: customers },
  "data-entries": { name: "Data Entries", icon: ClipboardList, data: dataEntries },
  factories: { name: "Factories", icon: Factory, data: factories },
  operators: { name: "Operators", icon: UserCog, data: operators },
  users: { name: "Users", icon: User, data: users },
  villages: { name: "Villages", icon: Home, data: villages },
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
  const projectSlug = resolvedParams?.project || "";
  const config = PROJECT_REGISTRY[projectSlug];
  const projectName = config ? config.name : titleize(projectSlug);

  return {
    title: `${projectName} | gluvok Dashboard`,
    description: `Manage and track ${projectName} entities on the gluvok platform.`,
  };
}

export default async function ProjectPage({ params }: Props) {
  const resolvedParams = await params;
  const projectSlug = resolvedParams?.project || "";
  const config = PROJECT_REGISTRY[projectSlug];

  if (!config) {
    notFound();
  }

  const { name: projectName, icon: IconComponent, data } = config;

  return (
    <>
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
                  <IconComponent className="h-3 w-3" />
                  {projectName}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="p-6">
        <div className="flex flex-col gap-1.5 mb-6">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <IconComponent className="h-6 w-6 text-primary" />
            {projectName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage the directory of {projectName.toLowerCase()}, edit records, and configure settings.
          </p>
        </div>
        <ProjectClient
          projectName={projectName}
          projectSlug={projectSlug}
          initialData={data}
        />
      </main>
    </>
  );
}
