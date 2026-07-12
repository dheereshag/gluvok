"use client"

/**
 * @file app/services/page.tsx
 * @description Services overview page.
 * Explains the three deployment and integration models offered to clients.
 */

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Layers,
  Database,
  Server,
  Cloud,
  ShieldAlert,
  HardDrive,
  Check,
  ShieldCheck,
  AlertTriangle,
  SlidersHorizontal,
  TableProperties,
  Sparkles,
  Link,
  TrendingUp,
  Zap,
  Clock,
  Box,
  Lock,
  Cpu,
  MessageSquare,
} from "lucide-react"
import { jakarta, inter } from "@/lib/fonts"

interface FeatureItem {
  text: string
  icon: React.ReactNode
}

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
  features: FeatureItem[]
  caveat?: string
  caveatType?: "warning" | "danger"
  successNote?: string
}

function ServiceCard({ icon, title, description, features, caveat, caveatType = "danger", successNote }: ServiceCardProps) {
  return (
    <div className={`relative flex flex-col gap-5 rounded-xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${inter.className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <h2 className={`${jakarta.className} text-lg font-bold leading-snug text-foreground`}>{title}</h2>
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

      <ul className="space-y-2.5">
        {features.map((f, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground">
            {f.icon}
            <span className="leading-relaxed">{f.text}</span>
          </li>
        ))}
      </ul>

      {caveat && (
        <div className={`flex items-start gap-2.5 rounded-lg border px-4 py-3 mt-auto transition-colors ${
          caveatType === "warning"
            ? "border-amber-500/30 bg-amber-500/5"
            : "border-destructive/30 bg-destructive/5"
        }`}>
          {caveatType === "warning" ? (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-500" />
          ) : (
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          )}
          <p className={`text-xs leading-relaxed ${
            caveatType === "warning"
              ? "text-amber-800 dark:text-amber-300"
              : "text-destructive/90"
          }`}>{caveat}</p>
        </div>
      )}

      {successNote && (
        <div className="flex items-start gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 mt-auto">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <p className="text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">{successNote}</p>
        </div>
      )}
    </div>
  )
}

const SERVICES: ServiceCardProps[] = [
  {
    title: "Bring Your Own Database and/or Object Storage",
    icon: <Database className="h-5 w-5" />,
    description:
      "Connect your database to our platform via our custom backend integration layer. Enjoy granular control over your fields and tables while keeping full ownership of your data hosting and performance management.",
    features: [
      {
        text: "Integrate your database directly into our backend platform.",
        icon: <Link className="h-4 w-4 text-primary shrink-0 mt-0.5" />,
      },
      {
        text: "Support custom storage buckets or use managed storage.",
        icon: <HardDrive className="h-4 w-4 text-primary shrink-0 mt-0.5" />,
      },
      {
        text: "Retain complete control over scaling performance.",
        icon: <TrendingUp className="h-4 w-4 text-primary shrink-0 mt-0.5" />,
      },
    ],
    caveat:
      "Your database health is your responsibility. Any service interruptions, slow queries, or data issues resulting from your database performance are not covered by our platform support.",
    caveatType: "warning",
  },
  {
    title: "Everything Fully Managed And Coordinated By Us",
    icon: <Cloud className="h-5 w-5" />,
    description:
      "Let us handle the infrastructure, from databases and server hosting to object storage setups. Get started instantly without DevOps overhead, while choosing how your tables and fields are structured.",
    features: [
      {
        text: "Host your database and backend server within our systems.",
        icon: <Cpu className="h-4 w-4 text-primary shrink-0 mt-0.5" />,
      },
      {
        text: "Deploy instantly without server setup or maintenance.",
        icon: <Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" />,
      },
      {
        text: "Guarantee high availability with system updates.",
        icon: <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />,
      },
    ],
    successNote:
      "We take full responsibility for database scaling, performance, security, and backups. Enjoy complete peace of mind with our fully monitored, highly available, and updated hosting services.",
  },
  {
    title: "Bring Your Own Private Application Server Host",
    icon: <Server className="h-5 w-5" />,
    description:
      "Host frontend and backend on your server using private Docker images with your database. Keep full deployment privacy and control without accessing the underlying business logic source code.",
    features: [
      {
        text: "Deploy our Docker containers directly on local servers.",
        icon: <Box className="h-4 w-4 text-primary shrink-0 mt-0.5" />,
      },
      {
        text: "Connect to either our storage or your storage bucket.",
        icon: <HardDrive className="h-4 w-4 text-primary shrink-0 mt-0.5" />,
      },
      {
        text: "Isolate application traffic within local networks.",
        icon: <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />,
      },
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
        {/* Split Section Layout */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-stretch rounded-2xl border bg-muted/30 p-6 md:p-8">
          {/* Left Column - Intro copy explaining deployment models */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-semibold text-primary w-fit shadow-sm">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>Deployment Options</span>
            </div>
            <h1 className={`${jakarta.className} text-3xl font-extrabold tracking-tight text-foreground`}>
              How We Work With You
            </h1>
            <p className={`${inter.className} text-muted-foreground text-sm leading-relaxed max-w-xl`}>
              Choose the deployment model that fits your team. Whether you own your infrastructure, want us to handle
              everything, or need a self-hosted setup — we have an option for you.
            </p>
          </div>

          {/* Right Column - Highlight box explaining the two common features */}
          <div className="flex flex-col justify-center space-y-4 border-t pt-6 md:border-t-0 md:pt-0 md:border-l md:pl-8 border-border">
            <h2 className={`${jakarta.className} text-xs font-bold uppercase tracking-wider text-muted-foreground`}>
              Standard Capabilities Across All Models
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3.5 p-4 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h3 className={`${jakarta.className} text-sm font-bold text-foreground`}>Granular Fields</h3>
                  <p className={`${inter.className} text-xs text-muted-foreground leading-relaxed`}>
                    Hide specific fields per entity (e.g., exclude govt_id for customers so it won't appear).
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3.5 p-4 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <TableProperties className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h3 className={`${jakarta.className} text-sm font-bold text-foreground`}>Entity Opt-outs</h3>
                  <p className={`${inter.className} text-xs text-muted-foreground leading-relaxed`}>
                    Opt out of tables completely (e.g., disable rates table entirely if you don't use it).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {SERVICES.map((service, idx) => (
            <ServiceCard key={idx} {...service} />
          ))}
        </div>

        <div className="flex items-start gap-3 rounded-xl border bg-muted/40 px-5 py-4 text-sm text-muted-foreground">
          <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className={inter.className}>
            Not sure which model is right for you? Reach out via <strong className="text-foreground">Support</strong> and
            our team will help you decide based on your infrastructure and scale requirements.
          </p>
        </div>
      </main>
    </>
  )
}
