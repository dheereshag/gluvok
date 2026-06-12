import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface DashboardCardProps {
  name: string
  href: string
  desc: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export function DashboardCard({ name, href, desc, icon: Icon, color }: DashboardCardProps) {
  const cardId = `dashboard-card-${name.toLowerCase().replace(/\s+/g, "-")}`
  return (
    <Link href={href} id={cardId} className="group block">
      <Card className="h-full border bg-card hover:border-muted-foreground/50 hover:bg-accent/50 transition-colors duration-200 cursor-pointer">
        <CardHeader className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2.5 rounded-xl bg-muted/50 group-hover:bg-primary/10 transition-colors duration-200 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
          </div>
          <CardTitle className="font-bold text-sm text-card-foreground group-hover:text-primary leading-none">
            {name}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            {desc}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
