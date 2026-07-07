"use client"

/**
 * @file app/services/page.tsx
 * @description Services overview page.
 * Explains the three deployment and integration models offered to clients.
 */

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Layers, Database, Server, Cloud, ShieldAlert, HardDrive, PackageCheck } from "lucide-react"

interface ServiceCardProps {
  icon: React.ReactNode
  badge: string
  title: string
  description: string
  features: string[]
  caveat?: string
  successNote?: string
}

function ServiceCard({ icon, badge, title, description, features, caveat, successNote }: ServiceCardProps) {
  return (
    <div className="relative flex flex-col gap-5 rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{badge}</p>
            <h2 className="text-lg font-bold leading-snug text-foreground">{title}</h2>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

      <ul className="space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-foreground">
            <PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {caveat && (
        <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 mt-auto">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <p className="text-xs leading-relaxed text-destructive/90">{caveat}</p>
        </div>
      )}

      {successNote && (
        <div className="flex items-start gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 mt-auto">
          <PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <p className="text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">{successNote}</p>
        </div>
      )}
    </div>
  )
}

const SERVICES: ServiceCardProps[] = [
  {
    badge: "Self-managed infrastructure",
    title: "Bring Your Own Database Storage",
    icon: <Database className="h-5 w-5" />,
    description:
      "Connect your own database to our platform via our custom backend integration layer. Enjoy granular control over your fields and tables while keeping full ownership of your data hosting and performance management.",
    features: [
      "Integrate your database directly into our backend platform layer.",
      "Support custom storage buckets or use our managed storage space.",
      "Retain complete ownership over your scaling and query performance.",
    ],
    caveat:
      "Your database health is your responsibility. Any service interruptions, slow queries, or data issues resulting from your database performance are not covered by our platform support.",
  },
  {
    badge: "Zero infrastructure",
    title: "Everything Fully Managed By Us",
    icon: <Cloud className="h-5 w-5" />,
    description:
      "Let us handle the infrastructure, from databases and server hosting to object storage setups. Get started instantly without DevOps overhead, while still choosing exactly how your tables and fields are structured.",
    features: [
      "Host your database and backend server directly within our systems.",
      "Deploy instantly without any server setup or maintenance workloads.",
      "Ensure high availability with continuous updates and configuration.",
    ],
    successNote:
      "We take full responsibility for database scaling, performance, security, and backups. Enjoy complete peace of mind with our fully monitored, highly available, and updated hosting services.",
  },
  {
    badge: "Self-hosted deployment",
    title: "Bring Your Own Application Server",
    icon: <Server className="h-5 w-5" />,
    description:
      "Host frontend and backend on your server using private Docker images with your database. Keep full deployment privacy and control without ever accessing the proprietary, underlying business logic source code.",
    features: [
      "Deploy pre-built Docker containers on your local server machines.",
      "Connect to either our storage space or your own storage bucket.",
      "Isolate all application traffic completely within your network.",
    ],
    caveat:
      "Any server crashes, hardware bottlenecks, configuration errors, or log issues arising from your self-hosted infrastructure are your sole responsibility. We do not provide server maintenance.",
  },
]

export default function ServicesPage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger id="sidebar-trigger-services" className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1.5 font-medium">
                  <Layers className="h-3.5 w-3.5" />
                  Services
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="p-8 w-full min-w-0 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">How We Work With You</h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Choose the deployment model that fits your team. Whether you own your infrastructure, want us to handle
            everything, or need a self-hosted setup — we have an option for you. All models support granular field-level exposure (e.g. hiding specific fields like govt_id for customers) and entity-level opt-outs (e.g. disabling the weighments table completely).
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {SERVICES.map((service, idx) => (
            <ServiceCard key={idx} {...service} />
          ))}
        </div>

        <div className="flex items-start gap-3 rounded-xl border bg-muted/40 px-5 py-4 text-sm text-muted-foreground">
          <HardDrive className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Not sure which model is right for you? Reach out via <strong className="text-foreground">Support</strong> and
            our team will help you decide based on your current infrastructure and scale requirements.
          </p>
        </div>
      </main>
    </>
  )
}
